package com.cpen321.gruwup;

import android.app.Dialog;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class DiscoverFragment extends Fragment {

    ArrayList<String> mAdventureList;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_discover, container, false);
        initAdventures();
        LinearLayoutManager layoutManager = new LinearLayoutManager(view.getContext());
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(),mAdventureList);
        adventureListView.setAdapter(adapter);
        return view;
    }

    private void showAdventures() {

    }

    private void initAdventures() {
        mAdventureList = new ArrayList<>();
        mAdventureList.add("Movies");
        mAdventureList.add("Sports");
        mAdventureList.add("Games");
        mAdventureList.add("A");
        mAdventureList.add("B");
        mAdventureList.add("C");
        mAdventureList.add("D");
        mAdventureList.add("E");
        mAdventureList.add("F");
        mAdventureList.add("G");
        mAdventureList.add("H");
        mAdventureList.add("I");
    }
}
