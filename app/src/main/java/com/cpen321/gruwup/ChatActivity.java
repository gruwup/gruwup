package com.cpen321.gruwup;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import java.util.ArrayList;

public class ChatActivity extends AppCompatActivity {

    private RecyclerView messageRecyclerView;
    private ArrayList<Message> messages = new ArrayList<>();
    private Button sendButton;
    private EditText editMessageBar;
    private String UserID;
    private String UserName;
//    private ArrayList<String> messageList = new ArrayList<>();

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


        messageRecyclerView = findViewById(R.id.messageRecyclerView);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        messageRecyclerView.setLayoutManager(linearLayoutManager);

        initMessages();
        MessageViewAdapter adapter = new MessageViewAdapter(this,messages);
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

                    if (adapter!=null){
                        adapter.notifyDataSetChanged();
                    }
                }


            }
        });

    }

    private  void initMessages(){
        Message m1 =  new Message("1", "sara", "hellooooo", "1111", "11111");
        Message m2 =  new Message("1", "sara", "hey!!", "1111", "11111");
        messages.add(m1);
        messages.add(m2);

    }
}