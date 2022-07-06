package com.cpen321.gruwup;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.engineio.client.transports.WebSocket;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;

public class ChatActivity extends AppCompatActivity {

    private RecyclerView messageRecyclerView;
    private MessageViewAdapter adapter;
    private ArrayList<Message> messages = new ArrayList<>();
    private Button sendButton;
    private EditText editMessageBar;
    private String UserID;
    private String UserName;
    static final String TAG = "ChatActivity";

    // local : "10.0.2.2" , remote: "20.227.142.169"
//    private String address = "10.0.2.2";
    private String address = "20.227.142.169";

    // socket implementation
    private Socket socket;
    {
        try{
            socket = IO.socket("http://"+address+":8000/");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    private boolean isSocketConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
        getSupportActionBar().hide();

        findViewById(R.id.leaveChat).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        connectSocket();

        messageRecyclerView = findViewById(R.id.messageRecyclerView);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        messageRecyclerView.setLayoutManager(linearLayoutManager);

        initMessages();
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
                    Message newMessage = new Message(UserID, UserName, message, "", "");
                    messages.add(newMessage);
                    editMessageBar.setText("");
                    if (adapter!=null){
                        adapter.notifyDataSetChanged();
                    }
                }


            }
        });

    }

    private void connectSocket() {
        socket.on(Socket.EVENT_CONNECT,onConnect);
        socket.on(Socket.EVENT_DISCONNECT, onDisconnect);
        socket.on(Socket.EVENT_CONNECT_ERROR, onConnectionError);
        socket.on(Socket.EVENT_CONNECT_TIMEOUT, onConnectionError);
        socket.on("connected", onNewMessage);
        socket.connect();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        socket.connect();
        socket.off(Socket.EVENT_CONNECT,onConnect);
        socket.off(Socket.EVENT_DISCONNECT, onDisconnect);
        socket.off(Socket.EVENT_CONNECT_ERROR, onConnectionError);
        socket.off(Socket.EVENT_CONNECT_TIMEOUT, onConnectionError);
        socket.off("connected", onNewMessage);

    }

//     Source: https://stackoverflow.com/questions/59324648/error-failed-to-resolve-com-github-nkzawasocket-io-client1-0-0,
//     https://socket.io/blog/native-socket-io-and-android/

    private Emitter.Listener onConnect = new Emitter.Listener(){

        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (!isSocketConnected){

                        // To do: replace this with actual cookie and userId
                        String cookie = "gruwup-session=123";
                        String userId = "116853060753534924974";

                        socket.emit("userInfo",cookie, userId);
                        Toast.makeText(getApplicationContext(), "Socket Connected",Toast.LENGTH_SHORT).show();
                        isSocketConnected = true;
                    }
                }
            });

        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    isSocketConnected = false;
                    Toast.makeText(getApplicationContext(), "Socket Disconnected" + args[0],Toast.LENGTH_SHORT).show();
                }
            });
        }
    };

    private Emitter.Listener onConnectionError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(getApplicationContext(),"Socket Connection Failed" +  args[0], Toast.LENGTH_SHORT).show();
                    Log.d(TAG, args[0].toString());
                }
            });
        }
    };

    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String userName, userId, message, time;
                    try{
                        userName = data.getString("name");
                        userId = data.getString("userId");
                        message = data.getString("message");
                        time = data.getString("dateTime");

                    } catch (JSONException e) {
                        e.printStackTrace();
                        return;
                    }

                    Toast.makeText(getApplicationContext(), userName, Toast.LENGTH_SHORT).show();
                    Message newMessage = new Message(userId, userName, message, time, "");
                    messages.add(newMessage);
                    editMessageBar.setText("");
                    if (adapter!=null){
                        adapter.notifyDataSetChanged();
                    }

                }
            });
        }
    };


    private  void initMessages(){
//        Message m1 =  new Message("1", "sara", "hellooooo", "1111", "11111");
//        Message m2 =  new Message("1", "sara", "hey!!", "1111", "11111");
//        messages.add(m1);
//        messages.add(m2);
    }
}