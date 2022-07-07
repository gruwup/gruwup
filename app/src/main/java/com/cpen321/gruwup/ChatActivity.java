package com.cpen321.gruwup;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class ChatActivity extends AppCompatActivity {

    private static final String SENT_MESSAGE = "sent";
    private static final String RECEIVED_MESSAGE = "received";
    private RecyclerView messageRecyclerView;
    private MessageViewAdapter adapter;
    private ArrayList<Message> messages = new ArrayList<>();
    private Button sendButton;
    private EditText editMessageBar;
    private String UserID;
    private String UserName;
    private String adventureTitle;
    private String adventureId;
    private Dialog adventureDialog;
    static final String TAG = "ChatActivity";

    // local : "10.0.2.2" , remote: "20.227.142.169"
    private String address = "10.0.2.2";
//    private String address = "20.227.142.169";

    // to do: add cookie
    private String cookie;

//    private String serverUrl = "http://20.227.142.169:8000";
    private String serverUrl = "http://"+address+":8000";


    // socket implementation
    private Socket mSocket;
    {
        try {
//            mSocket = IO.socket("http://chat.socket.io");
            mSocket = IO.socket(serverUrl);
            // TP DO: replace with actual cookie and userId
            mSocket.emit("userInfo", "gruwup-session=123",  "116853060753534924974");

        } catch (URISyntaxException e) {}
    }


    public void sendChat(String message){
//        SupportRequests.postWithCookie();
        Log.d(TAG, "send ====>"+ message);
        // To do: replace with actual userId, name, dateTimes
        Message sendMessage = new Message("116853060753534924974","Sijan",message,"", "", SENT_MESSAGE);

        // send to : http://localhost:8000/user/chat/62bd32f3193cbe5ebcfb1c10/send
        // json structure:
//        {
//            "userId": "116853060753534924974",
//                "name": "Sijan",
//                "message": "cool wanna hang out?",
//                "dateTime": "13131238",
//                "prevTime":"13131233"
//        }

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userId", sendMessage.getUserId());
            jsonObject.put("name", sendMessage.getName());
            jsonObject.put("dateTime", sendMessage.getDateTime());
            jsonObject.put("prevTime", sendMessage.getPrevTime());
            jsonObject.put("message", sendMessage.getMessage());

        } catch (JSONException e) {
            e.printStackTrace();
        }

        // To do: replace this with intent value , and cookie value
        adventureId = "62bd32f3193cbe5ebcfb1c10";
        cookie = "gruwup-session=123";
        SupportRequests.postWithCookie("http://" + address + ":8000/user/chat/" + adventureId + "/send",  jsonObject.toString(), cookie, new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Could not send message");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()) {
                    Log.d(TAG, "message sent successfully");
                }
                else{
                    Log.d(TAG, "message failed to send" + response.toString());
                }
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        getSupportActionBar().hide();

        Intent intent= getIntent();
        adventureTitle = intent.getStringExtra("name");
        adventureId = intent.getStringExtra("adventureId");

        TextView adventureName = (TextView) findViewById(R.id.advTitle);
        adventureName.setText(adventureTitle);

        adventureDialog = new Dialog(this);
        ImageView adventureInfo = (ImageView) findViewById(R.id.adventureInfo);

        adventureInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showPopUp(view);
            }
        });

        findViewById(R.id.leaveChat).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        findViewById(R.id.advTitle).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Adventure Title clicked");
            }
        });

        mSocket.on("connected", isConnected);

        mSocket.connect();

        messageRecyclerView = findViewById(R.id.messageRecyclerView);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        messageRecyclerView.setLayoutManager(linearLayoutManager);

        adapter = new MessageViewAdapter(this,messages);
        messageRecyclerView.setAdapter(adapter);

        UserID = SupportSharedPreferences.getUserId(getApplicationContext());
        UserName = SupportSharedPreferences.getUserName(getApplicationContext());
        editMessageBar = findViewById(R.id.editMesssage);
        sendButton = findViewById(R.id.sendMessage);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String message = editMessageBar.getText().toString().trim();
                if (message!=null && !message.isEmpty()){
                    // TO DO: Add datetime later
                    Message newMessage = new Message(UserID, UserName, message, "", "",SENT_MESSAGE);
                    messages.add(newMessage);
                    editMessageBar.setText("");
                    // To do: make post request inside sendChat

                    sendChat(message);
                    if (adapter!=null){
                        adapter.notifyDataSetChanged();
                    }
                }


            }
        });

    }

    private void showPopUp(View view){
        adventureDialog.setContentView(R.layout.adventure_detail_pop_up);
        adventureDialog.show();

        TextView goBack = adventureDialog.findViewById(R.id.go_back_chat);

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                adventureDialog.dismiss();
            }
        });

    }

    private Emitter.Listener isConnected = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if(args[0].toString().equals("true")){
                        Log.d(TAG, "===>connected to socket");
                        mSocket.on("message",onNewMessage);
                    }
                    else{
                        Log.d(TAG, "===>cannot connect to socket");
                    }
                }
            });
        }
    };


    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "adventure ID=====>"+ args[0].toString());
                    Log.d(TAG, "message=====>"+ args[1].toString());
                    JSONObject data = (JSONObject) args[1];

                    String userName;
                    String userId;
                    String message;
                    String dateTime;
                    // To do: need adventureId?
                    // To do: remove prevTime if not needed
                    String prevTime;
                    String messageStatus;

                    try {
                        userName = data.getString("name");
                        userId = data.getString("userId");
                        message = data.getString("message");
                        dateTime = data.getString("dateTime");
                        prevTime = "";
                        messageStatus = RECEIVED_MESSAGE;
                        Message newMessage = new Message(userId,userName,message,dateTime,prevTime,messageStatus);
                        messages.add(newMessage);
                        if (adapter!=null){
                            adapter.notifyDataSetChanged();
                        }


                    } catch (JSONException e) {
                        return;
                    }

                }
            });
        }
    };

//    @Override
//    public void onDestroy() {
//        super.onDestroy();
//        mSocket.disconnect();
//        mSocket.off("message",onNewMessage);
//    }


}