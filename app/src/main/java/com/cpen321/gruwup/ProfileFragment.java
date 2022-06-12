package com.cpen321.gruwup;

import android.app.Dialog;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.squareup.picasso.Picasso;

public class ProfileFragment extends Fragment {
    TextView displayName;
    ImageView profilePic;

    Dialog profileDialog;
    Button editButton;
    final static String TAG = "ProfileFragment";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view= inflater.inflate(R.layout.fragment_profile, container, false);

        displayName = (TextView) view.findViewById(R.id.userName);
        displayName.setText(this.getArguments().getString("Display_Name"));
        profilePic = (ImageView) view.findViewById(R.id.userImage);
        if(this.getArguments().getString("Photo_URL") != null && !this.getArguments().getString("Photo_URL").equals("")) {
            Picasso.get().load(this.getArguments().getString("Photo_URL")).into(profilePic);
        }
        System.out.println(this.getArguments().getString("Photo_URL"));
        //set profile picture using the link from the bundle using Picasso

        profileDialog = new Dialog(getActivity());

        editButton = view.findViewById(R.id.edit_profile_button);

        editButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Edit Icon Clicked");
                showPopUp(view);
            }
        });
        return view;
    }

    public void showPopUp(View v){
        TextView goBack;
        Button confirmButton;

        profileDialog.setContentView(R.layout.profile_pop_up);
        goBack  = (TextView) profileDialog.findViewById(R.id.goBack);
        goBack.setPaintFlags(goBack.getPaintFlags()|Paint.UNDERLINE_TEXT_FLAG);
        confirmButton = (Button) profileDialog.findViewById(R.id.confirmButton);
        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                profileDialog.dismiss();
            }
        });
        profileDialog.show();
    }

}
