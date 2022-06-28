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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class ProfileFragment extends Fragment {
    TextView displayName;
    ImageView profilePic;
    Button signOutButton;
    private GoogleSignInClient mGoogleSignInClient;

    Dialog profileDialog;
    Button editButton;
    final static String TAG = "ProfileFragment";

    String UserID;
    String cookie;

    RecyclerView categoryView ;
    RecyclerView selectedCategories ;

    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();

    // TO DO: Can make this common later to avoid DRY
    private void initCategories(){
        mCategoryNames.add("MOVIE");
        mCategoryNames.add("MUSIC");
        mCategoryNames.add("SPORTS");
        mCategoryNames.add("FOOD");
        mCategoryNames.add("TRAVEL");
        mCategoryNames.add("DANCE");
        mCategoryNames.add("ART");
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view= inflater.inflate(R.layout.fragment_profile, container, false);

        // Note: get stored UserID this way for fragment
        UserID = SupportSharedPreferences.getUserId(this.getActivity());
        cookie = SupportSharedPreferences.getCookie(this.getActivity());

        mGoogleSignInClient = GoogleSignIn.getClient(getActivity(), GoogleSignInOptions.DEFAULT_SIGN_IN);
        displayName = (TextView) view.findViewById(R.id.requesterName);
        displayName.setText(this.getArguments().getString("Display_Name"));

        profilePic = (ImageView) view.findViewById(R.id.userImage);
        if(this.getArguments().getString("Photo_URL") != null && !this.getArguments().getString("Photo_URL").equals("")) {
            Picasso.get().load(this.getArguments().getString("Photo_URL")).into(profilePic);
        }
        System.out.println(this.getArguments().getString("Photo_URL"));
        //set profile picture using the link from the bundle using Picasso
        try {
            getProfileRequest();
        } catch (IOException e) {
            e.printStackTrace();
            Log.d(TAG, e.toString());
        }
        categoryView = (RecyclerView) view.findViewById(R.id.categoryRecyclerView);
        selectedCategories = (RecyclerView) view.findViewById(R.id.selectedCategories);

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
                signOutRequest();
            }
        });
        Log.d(TAG, "Selected Categories "+mSelectedCategoryNames);
        return view;
    }

    public void showPopUp(View v){
        TextView goBack;
        Button confirmButton;
        EditText bioInput;
        TextView bioValidation;
        TextView categoryValidation;
        TextView userBio;

        mSelectedCategoryNames.clear();

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
        categoryView = (RecyclerView) profileDialog.findViewById(R.id.categoryRecyclerView);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(),mCategoryNames);
        categoryView.setAdapter(adapter);

        LinearLayoutManager categoriesLayoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        selectedCategories = (RecyclerView) getView().findViewById(R.id.selectedCategories);
        selectedCategories.setLayoutManager(categoriesLayoutManager);

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Note: can change this to display from cache  (previous selected categories)
                try {
                    getProfileRequest();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                profileDialog.dismiss();
            }
        });
        confirmButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Pressed Confirm Button");
                Log.d(TAG, bioInput.getText().toString());

                if (!verifyUserInput(bioInput).equals("valid")){
                    bioValidation.setText(verifyUserInput(bioInput));
                }
                else if(adapter.getSelectedCategoriesCount()<3){
                    categoryValidation.setText("Please select at least 3 categories.");
                }
                else{
                    userBio.setText(bioInput.getText().toString());
                    for (int i = 0 ; i < adapter.getSelectedCategoriesCount(); i++){
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }
                    CategoryViewAdapter selectedCategoriesAdapter = new CategoryViewAdapter(getActivity(),mSelectedCategoryNames);
                    selectedCategories.setAdapter(selectedCategoriesAdapter);

                    // Note: Can store this in cache
                    Log.d(TAG, "Selected categories names are: "+ mSelectedCategoryNames);
                    try {
                        editProfileRequest(bioInput.getText().toString(), mSelectedCategoryNames);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    profileDialog.dismiss();

                    Toast.makeText(getActivity(), "Changed Profile Information", Toast.LENGTH_SHORT).show();
                }
            }
        });

        profileDialog.show();
    }

    private void signOutRequest(){
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userId", UserID);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        SupportRequests.postWithCookie("http://10.0.2.2:8081/account/sign-out", jsonObject.toString(), cookie, new Callback(){

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                Log.d(TAG, "sign out successful");

                //return user to login screen in the LoginActivity
                Intent intent = new Intent(getActivity(), LogInActivity.class);
                startActivity(intent);
            }

            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "sign out failed");
            }
        });

    }

    private void getProfileRequest() throws IOException{
        // To do: replace this with server url
        SupportRequests.get("http://10.0.2.2:8081/user/profile/" + UserID + "/get",  new Callback() {

            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "get profile unsuccessful");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "get profile successful");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
                        Log.d(TAG, "json Obj "+ jsonObj.toString());
                        String bio = jsonObj.getString("biography");
                        Log.d(TAG, "Bio is "+ bio);
                        JSONArray pref = jsonObj.getJSONArray("categories");
                        Log.d(TAG, "Pref is "+ pref);

                        ArrayList<String> preferences_list = new ArrayList<String>();
                        if (pref !=null){
                            for (int i=0; i<pref.length(); i++){
                                preferences_list.add(pref.getString(i));
                            }
                        }

                        Log.d(TAG, "List: "+ preferences_list);
                        // Display preferences in profile
                        mSelectedCategoryNames = preferences_list;
                        getActivity().runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                // Stuff that updates the UI
                                TextView userBio = (TextView) getView().findViewById(R.id.userBio);
                                userBio.setText(bio);
                                RecyclerView.LayoutManager mLayoutManafer = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
                                selectedCategories.setLayoutManager(mLayoutManafer);
                                CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(), preferences_list);
                                selectedCategories.setAdapter(adapter);
                            }
                        });

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
                else {
                    Log.d(TAG, "get profile unsuccessful");
                }
            }
        });

    }

    private void editProfileRequest(String bioInput, ArrayList<String> categoryNames) throws IOException {

        Log.d(TAG, "bio is "+ bioInput);
        JSONObject jsonObject = new JSONObject();

        JSONArray preferences = new JSONArray(categoryNames);
        try {
            jsonObject.put("userId", UserID);
            jsonObject.put("name", displayName.toString());
            jsonObject.put("biography", bioInput);
            jsonObject.put("categories", preferences);
            jsonObject.put("image", this.getArguments().getString("Photo_URL"));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // To do: change this later with server url
        SupportRequests.put("http://10.0.2.2:8081/user/profile/" + UserID + "/edit", jsonObject.toString(), new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "could not edit the user profile");
                Log.d(TAG, e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "profile edit successful");
                }
                else{
                    Log.d(TAG, "profile edit unsuccessful");
                    Log.d(TAG, response.message().toString());
                    Log.d(TAG, response.toString());
                }
            }
        });

    }

    public static String verifyUserInput(EditText field) {
        if (field.getText().toString().trim().equals("")){
            return "This field cannot be empty.";
        }
        else if (!field.getText().toString().matches("[a-zA-Z.? ]*")){
            return "This field only allows numbers, spaces and letters.";
        }
        else {
            return "valid";
        }
    }
}