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

public class RequestsFragment extends Fragment {
    ArrayList<User> users = new ArrayList<>();

    private void initChatData(){
        User tom = new User("1","Tom","", "yey", "['MOVIE', 'DANCE']");
        User dan = new User("2","Dan","", "woo", "['MOVIE', 'DANCE']");
        users.add(tom);
        users.add(dan);
    }
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_requests, container, false);

        initChatData();
        RequestViewAdapter adapter = new RequestViewAdapter(getActivity(),users);
        RecyclerView requestView = (RecyclerView) view.findViewById(R.id.getRequestView);
        requestView.setLayoutManager(new LinearLayoutManager(getActivity()));
        requestView.setAdapter(adapter);

        return view;
    }
}
