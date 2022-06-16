package com.cpen321.gruwup;

import android.app.Dialog;
import android.content.Intent;
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

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class ProfileFragment extends Fragment {
    TextView displayName;
    ImageView profilePic;
    Button signOutButton;
    private GoogleSignInClient mGoogleSignInClient;

    Dialog profileDialog;
    Button editButton;
    final static String TAG = "ProfileFragment";

    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    private ArrayList<Integer> mSelectedCategoryIds = new ArrayList<>();

    private ArrayList<String> tmpSelectedCategoryNames = new ArrayList<>();
    private ArrayList<Integer> tmpSelectedCategoryIds = new ArrayList<>();


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

        mGoogleSignInClient = GoogleSignIn.getClient(getActivity(), GoogleSignInOptions.DEFAULT_SIGN_IN);

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


        signOutButton = (Button) view.findViewById(R.id.sign_out_button);
        signOutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("ProfileFragment", "Signing out");
                mGoogleSignInClient.signOut();
                Intent intent = new Intent(getActivity(), LogInActivity.class);
                startActivity(intent);


                //should return user to login screen in the LoginActivity
            }
        });

        return view;
    }

    public void showPopUp(View v){
        TextView goBack;
        Button confirmButton;
        EditText bioInput;
        TextView bioValidation;
        TextView categoryValidation;
        TextView userBio;

        tmpSelectedCategoryNames = mSelectedCategoryNames;
        tmpSelectedCategoryIds = mSelectedCategoryIds;
        mSelectedCategoryNames.clear();
        mSelectedCategoryIds.clear();

        profileDialog.setContentView(R.layout.profile_pop_up);
        goBack  = (TextView) profileDialog.findViewById(R.id.goBack);
        goBack.setPaintFlags(goBack.getPaintFlags()|Paint.UNDERLINE_TEXT_FLAG);
        confirmButton = (Button) profileDialog.findViewById(R.id.confirmButton);
        bioInput = (EditText) profileDialog.findViewById(R.id.biographyInput);
        bioValidation = (TextView) profileDialog.findViewById(R.id.biographyAlert);
        categoryValidation = (TextView) profileDialog.findViewById(R.id.categoryAlert);
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

        LinearLayoutManager categoriesLayoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        RecyclerView selectedCategories = (RecyclerView) getView().findViewById(R.id.selectedCategories);
        selectedCategories.setLayoutManager(categoriesLayoutManager);


        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // To do: change this to display from API call from backend (previous selected categories)
                mSelectedCategoryIds = tmpSelectedCategoryIds;
                mSelectedCategoryNames = tmpSelectedCategoryNames;
                CategoryViewAdapter selectedCategoriesAdapter = new CategoryViewAdapter(getActivity(),mSelectedCategoryNames);
                selectedCategories.setAdapter(selectedCategoriesAdapter);
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
                else if(adapter.getSelectedCategoriesCount()<3){
                    categoryValidation.setText("Please select atleast 3 categories. ");
                }
                else{
                    // To Do: Once API is set, send this information needs to be sent to backend
                    userBio.setText(bioInput.getText().toString());


                    for (int i = 0 ; i < adapter.getSelectedCategoriesCount(); i++){
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                        mSelectedCategoryIds.add(adapter.getSelectedCategories().get(i));


                    }
                    CategoryViewAdapter selectedCategoriesAdapter = new CategoryViewAdapter(getActivity(),mSelectedCategoryNames);
                    selectedCategories.setAdapter(selectedCategoriesAdapter);
                    Log.d(TAG, "Selected categories names are: "+ mSelectedCategoryNames);
                    Log.d(TAG, "Selected category ids are: "+ mSelectedCategoryIds);
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
