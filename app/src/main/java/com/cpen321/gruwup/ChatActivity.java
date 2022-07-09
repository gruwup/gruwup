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


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

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
    private TextView loadOldMessage;

    private String UserID;
    private String UserName;
    private String adventureTitle;
    private String adventureId;
    private Dialog adventureDialog;
    private String pagination;
    private String prevPagination;


    static final String TAG = "ChatActivity";

    // local : "10.0.2.2" , remote: "20.227.142.169"
    private String address = "10.0.2.2";
//    private String address = "20.227.142.169";


    private String cookie;

//    private String serverUrl = "http://20.227.142.169:8000";
    private String serverUrl = "http://"+address+":8000";


    // socket implementation
    private Socket mSocket;
    {
//        try {
////            cookie = SupportSharedPreferences.getCookie(getApplicationContext());
////            UserID = SupportSharedPreferences.getUserId(getApplicationContext());
//            cookie = "gruwup-session=123";
//            UserID = "112559584626040550555";
//            mSocket = IO.socket(serverUrl);
//            mSocket.emit("userInfo", cookie, UserID);
//
//        } catch (URISyntaxException e) {}
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        getSupportActionBar().hide();

        Intent intent= getIntent();
        adventureTitle = intent.getStringExtra("name");
        adventureId = intent.getStringExtra("adventureId");
        pagination = intent.getStringExtra("dateTime");


        getPreviousMessages(pagination);

        UserName = SupportSharedPreferences.getUserName(getApplicationContext());
        cookie = SupportSharedPreferences.getCookie(getApplicationContext());
        UserID = SupportSharedPreferences.getUserId(getApplicationContext());


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
//                Intent i = new Intent( ChatActivity.this,ChatFragment.class);
//                startActivity(i);
            }
        });

        findViewById(R.id.advTitle).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Adventure Title clicked");
            }
        });

        try {
            // Note: dynamic cookie is not working for chat
            cookie = "gruwup-session=123";
//            cookie = SupportSharedPreferences.getCookie(getApplicationContext());
            UserID = SupportSharedPreferences.getUserId(getApplicationContext());

            mSocket = IO.socket(serverUrl);
            mSocket.emit("userInfo", cookie, UserID);

        } catch (URISyntaxException e) {}

        mSocket.on("connected", isConnected);

        mSocket.connect();

//        Intent serviceIntent = new Intent(this, SocketService.class);
//        startService(serviceIntent);

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

                    // check datetime format
                    long currentTimestamp = System.currentTimeMillis()/1000;
                    Message newMessage = new Message(UserID, UserName, message, Long.toString(currentTimestamp),SENT_MESSAGE);
                    messages.add(newMessage);
                    editMessageBar.setText("");
                    sendChat(message);
                    if (adapter!=null){
//                        adapter.notifyDataSetChanged();
                        messageRecyclerView.scrollToPosition(adapter.getItemCount() - 1);
                    }
                }


            }
        });

    }


    private void getPreviousMessages(String pagination) {
        // To do: get all the user chat history
//http://localhost:8081/user/chat/62c65ee5b7831254ed671749/messages/1657196043

        UserID = SupportSharedPreferences.getUserId(getApplicationContext());
        cookie = SupportSharedPreferences.getCookie(getApplicationContext());
        SupportRequests.getWithCookie("http://" + address + ":8000/user/chat/" + adventureId + "/messages/" + pagination, cookie, new Callback() {

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                Log.d(TAG, "");
                if(response.isSuccessful()) {
                    Log.d(TAG, "message history received successfully");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
                        JSONArray messageArray = jsonObj.getJSONArray("messages");
                        prevPagination = jsonObj.getString("prevPagination");
                        JSONObject messageObj = new JSONObject();
                        if (messageArray !=null ){
                            for (int i=messageArray.length()-1; i>=0; i--) {

                                messageObj = messageArray.getJSONObject(i);
//                                Log.d(TAG, messageObj.toString());
                                String name = messageObj.getString("name");
                                String userId = messageObj.getString("userId");
                                String message = messageObj.getString("message");
                                String dateTime = messageObj.getString("dateTime");
                                Message oldMessage;

                                if(UserID.equals(userId)){
                                    oldMessage = new Message(userId, name, message, dateTime, SENT_MESSAGE);
                                }
                                else{
                                    oldMessage = new Message(userId, name, message, dateTime, RECEIVED_MESSAGE);
                                }
                                Log.d(TAG, ">>>>>>>>>>>"+oldMessage.name+":"+oldMessage.message);

                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        messages.add(0,oldMessage);
                                        if (adapter!=null){
                                            adapter.notifyDataSetChanged();
                                        }
                                    }
                                });

                            }}

                        Log.d(TAG, " message history json Obj " + jsonObj.toString());

                        // if prevPagination is not null display load older messages
                        // upon clicking display old messages call api call and hide text view
                        loadOldMessage = (TextView) findViewById(R.id.loadMessage);
                        loadOldMessage.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                if (!(("null").equals(prevPagination))){
//                                    loadOlderMessages(prevPagination);
                                    getPreviousMessages(prevPagination);
                                }
                                else {
                                    Log.d("Prev ", "set visibility to none");
                                    loadOldMessage.setText("This is start of your conversations");
                                }

                            }
                        });


                    }catch (Exception e){
                        e.printStackTrace();
                    }

                }
                else{
                    Log.d(TAG, "message history failed to load" + response.toString());
                }
            }

            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to retrieve chat history");
            }
        });
    }

    public void sendChat(String message){

        // check if userId is assigned
        long currentTimestamp = System.currentTimeMillis()/1000;
        Message sendMessage = new Message(UserID,UserName,message,Long.toString(currentTimestamp),SENT_MESSAGE);

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userId", sendMessage.getUserId());
            jsonObject.put("name", sendMessage.getName());
            jsonObject.put("dateTime", sendMessage.getDateTime());
            jsonObject.put("message", sendMessage.getMessage());

        } catch (JSONException e) {
            e.printStackTrace();
        }


//        cookie = "gruwup-session=123";
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


    private void showPopUp(View view){
        adventureDialog.setContentView(R.layout.adventure_detail_pop_up);

        // make get request for adventures

        getAdventureDetails();
        adventureDialog.show();
        TextView goBack = adventureDialog.findViewById(R.id.go_back_chat);

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                adventureDialog.dismiss();
            }
        });

    }

    private void getAdventureDetails() {

        // url: http://localhost:8081/user/adventure/62c65ee5b7831254ed671749/detail

        SupportRequests.get("http://" + address + ":8081/user/adventure/" + adventureId + "/detail", new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to get adventure details");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()) {
                    Log.d(TAG, "get profile successful");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
//                        Log.d(TAG, "json Obj "+ jsonObj.toString());
                        String title = jsonObj.getString("title");
                        String description = jsonObj.getString("description");
                        String eventType = jsonObj.getString("category");
                        Integer memberCount = jsonObj.getJSONArray("peopleGoing").length();
                        String time = jsonObj.getString("dateTime");
                        String location = jsonObj.getString("location");

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                TextView titleView = adventureDialog.findViewById(R.id.advTitle);
                                titleView.setText(title);

                                TextView typeView = adventureDialog.findViewById(R.id.view_adventure_event_type);
                                typeView.setText(eventType);

                                TextView countView = adventureDialog.findViewById(R.id.view_adventure_member_count) ;
                                countView.setText(memberCount.toString());

                                TextView timeView = adventureDialog.findViewById(R.id.view_adventure_time);
                                // assuming time is obtained in seconds epoch time
                                Date date = new Date(Long.parseLong(time, 10)*1000);
                                DateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                                String formatted = format.format(date);
                                formatted = format.format(date);
                                timeView.setText(formatted);

                                TextView locationView = adventureDialog.findViewById(R.id.view_adventure_location);
                                locationView.setText(location);

                                TextView descriptionView = adventureDialog.findViewById(R.id.adventure_description);
                                descriptionView.setText(description);

                            }
                        });



                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                else{
                    Log.d(TAG, "Failed to get adventure details");
                }
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
                        Log.d(TAG , args[0].toString());
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
                        Message newMessage = new Message(userId,userName,message,dateTime,messageStatus);
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