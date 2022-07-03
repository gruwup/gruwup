package com.cpen321.gruwup;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class RequestsFragment extends Fragment {
    ArrayList<Request> requests = new ArrayList<>();

    private void initRequestData(){
        Request tom = new Request("Movie", "Tom", "116853060753534924974", "22", "PENDING");
        Request dan = new Request("Sport", "Dan", "112559584626040550555", "23", "PENDING");
        requests.add(tom);
        requests.add(dan);
    }
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_requests, container, false);

        initRequestData();
        RequestViewAdapter adapter = new RequestViewAdapter(getActivity(),requests);
        RecyclerView requestView = (RecyclerView) view.findViewById(R.id.getRequestView);
        requestView.setLayoutManager(new LinearLayoutManager(getActivity()));
        requestView.setAdapter(adapter);

        return view;

    }
}
