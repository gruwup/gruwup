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
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class ProfileFragment extends Fragment {
    TextView displayName;
    ImageView profilePic;

    Dialog profileDialog;
    Button editButton;
    final static String TAG = "ProfileFragment";

    private ArrayList<String> mCategoryNames = new ArrayList<>();

    private void initCategories(){
        mCategoryNames.add("Movies");
        mCategoryNames.add("Sports");
        mCategoryNames.add("Games");
        mCategoryNames.add("Food");
        mCategoryNames.add("Party");
        mCategoryNames.add("Convention");
        mCategoryNames.add("Show");
//        initCategoryRecyclerView(view);
    }

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
        EditText bioInput;
        TextView bioValidation;
        TextView userBio;

        profileDialog.setContentView(R.layout.profile_pop_up);
        goBack  = (TextView) profileDialog.findViewById(R.id.goBack);
        goBack.setPaintFlags(goBack.getPaintFlags()|Paint.UNDERLINE_TEXT_FLAG);
        confirmButton = (Button) profileDialog.findViewById(R.id.confirmButton);
        bioInput = (EditText) profileDialog.findViewById(R.id.biographyInput);
        bioValidation = (TextView) profileDialog.findViewById(R.id.biographyAlert);
        userBio = (TextView) getView().findViewById(R.id.userBio);
        
        // for categories
        initCategories();
        Log.d(TAG, "Initialize Category Recycler View");
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        RecyclerView categoryView = (RecyclerView) profileDialog.findViewById(R.id.categoryRecyclerView);
//        categoryView.setHasFixedSize(true);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(),mCategoryNames);
        categoryView.setAdapter(adapter);

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                profileDialog.dismiss();
            }
        });
        confirmButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Pressed Confirm Button");
                Log.d(TAG, bioInput.getText().toString());

                if (bioInput.getText().toString().trim().equals("")){
                    bioValidation.setText("Biography cannot be set empty.");
                }
                else if (!bioInput.getText().toString().matches("[a-zA-Z.? ]*")){
                    bioValidation.setText("Biography can only allow numbers, spaces and letters.");
                }
                else{
                    // To Do: Once API is set, send this information needs to be sent to backend
                    userBio.setText(bioInput.getText().toString());
                    profileDialog.dismiss();
                    Toast.makeText(getActivity(), "Changed Profile Information", Toast.LENGTH_SHORT).show();
                }

            }
        });

        profileDialog.show();
    }

//    private void initCategoryRecyclerView(View view){
//        Log.d(TAG, "Initialize Category Recycler View");
//        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
//        RecyclerView categoryRecyclerView = view.findViewById(R.id.categoryRecyclerView);
//        categoryRecyclerView.setLayoutManager(layoutManager);
//        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(),mCategoryNames, mCategoryImages);
//        categoryRecyclerView.setAdapter(adapter);
//    }

}
