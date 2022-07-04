package com.cpen321.gruwup;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import java.util.ArrayList;

public class ChatActivity extends AppCompatActivity {

    private RecyclerView messageRecyclerView;
    ArrayList<Message> messages = new ArrayList<>();



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
    }

    private  void initMessages(){
        Message m1 =  new Message("1", "sara", "hellooooo", "1111", "11111");
        messages.add(m1);

    }
}