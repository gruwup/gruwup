package com.cpen321.gruwup;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class ChatFragment extends Fragment {

//    ArrayList <User> users = new ArrayList<>();
    ArrayList <Adventure> adventures = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_chat, container, false);

        initChatData();
        ChatViewAdapter adapter = new ChatViewAdapter(getActivity(),adventures);
        RecyclerView chatView = (RecyclerView) view.findViewById(R.id.chatView);
        chatView.setLayoutManager(new LinearLayoutManager(getActivity()));
        chatView.setAdapter(adapter);

        return view;
    }

    private void initChatData(){
//        User tom = new User("1","Tom","", "yey", "['MOVIE', 'DANCE']");
//        User dan = new User("2","Dan","", "woo", "['MOVIE', 'DANCE']");
//        users.add(tom);
//        users.add(dan);

        Adventure movie = new Adventure("","Movie Night", "62c65ee5b7831254ed671749","hows it going everyone", "1011");

        adventures.add(movie);
    }
}
