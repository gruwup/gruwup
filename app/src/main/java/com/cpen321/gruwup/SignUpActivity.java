package com.cpen321.gruwup;

import static com.cpen321.gruwup.ProfileFragment.verifyUserInput;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SignUpActivity extends AppCompatActivity {

    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    RecyclerView categoryView ;
    RecyclerView selectedCategories ;
    static final String TAG = "SignUpActivity";
    //Change this to dynamic
    String UserID = "27";

    private void initCategories(){
        mCategoryNames.add("MOVIE");
        mCategoryNames.add("MUSIC");
        mCategoryNames.add("SPORTS");
        mCategoryNames.add("FOOD");
        mCategoryNames.add("TRAVEL");
        mCategoryNames.add("DANCE");
        mCategoryNames.add("ART");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
        getSupportActionBar().hide();

        initCategories();
        LinearLayoutManager layoutManager = new LinearLayoutManager(SignUpActivity.this, LinearLayoutManager.HORIZONTAL, false);
        categoryView = (RecyclerView) findViewById(R.id.setUpPreferences);
        categoryView.setLayoutManager(layoutManager);

        CategoryViewAdapter adapter = new CategoryViewAdapter(SignUpActivity.this,mCategoryNames);
        categoryView.setAdapter(adapter);

        EditText bioInput = (EditText) findViewById(R.id.setBio);
        TextView bioValidation = (TextView) findViewById(R.id.setBioAlert);
        TextView categoryValidation = (TextView) findViewById(R.id.selectCategoryAlert);
        Button setProfileBtn = (Button) findViewById(R.id.setupProfileButton);

        setProfileBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!verifyUserInput(bioInput).equals("valid")){
                    bioValidation.setText(verifyUserInput(bioInput));
                }
                else if(adapter.getSelectedCategoriesCount()<3){
                    categoryValidation.setText("Please select at least 3 categories.");
                }
                else {
                    // pass selected categories for creating profile
//                    userBio.setText(bioInput.getText().toString());
                    for (int i = 0 ; i < adapter.getSelectedCategoriesCount(); i++){
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }

                    String displayName = getIntent().getStringExtra("Display_Name");
                    String profileUrl = getIntent().getStringExtra("Photo_URL");

                    try {
                        createProfileRequest(displayName, profileUrl,bioInput.getText().toString(),mSelectedCategoryNames);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
                    Bundle extras = new Bundle();
                    extras.putString("Display_Name", displayName);
                    extras.putString("Photo_URL", profileUrl);
                    intent.putExtras(extras);
                    startActivity(intent);
                }

            }
        });

    }


    private void createProfileRequest( String displayName, String profileUrl, String bioInput, ArrayList<String> categoryNames) throws IOException {

        Log.d(TAG, "bio is "+ bioInput);
        JSONObject jsonObject = new JSONObject();
        JSONArray preferences = new JSONArray(categoryNames);

        try {
            jsonObject.put("userId", UserID);
            jsonObject.put("name", displayName);
            jsonObject.put("biography", bioInput);
            jsonObject.put("categories", preferences);
            jsonObject.put("image", profileUrl);
            Log.d(TAG, "jsonObj"+ jsonObject);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        // To do: change this later with server url
        post("http://10.0.2.2:8081/user/profile/create", jsonObject.toString(), new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "could not create the user profile");
                Log.d(TAG, e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "create profile successful");
                }
                else{
                    Log.d(TAG, "create profile unsuccessful");
                    Log.d(TAG, response.toString());
                }
            }
        });

    }

    // To do: make this common
    private Call post(String url , String json , Callback callback){
        OkHttpClient client = new OkHttpClient();
        MediaType JSON = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }
}