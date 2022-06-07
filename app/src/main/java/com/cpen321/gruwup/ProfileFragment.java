package com.cpen321.gruwup;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class ProfileFragment extends Fragment {
    TextView displayName;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view= inflater.inflate(R.layout.fragment_profile, container, false);

        displayName = (TextView) view.findViewById(R.id.userName);
        displayName.setText(this.getArguments().getString("Display_Name"));

//        Toast.makeText(this, username, Toast.LENGTH_LONG).show();

        return view;
    }
}
