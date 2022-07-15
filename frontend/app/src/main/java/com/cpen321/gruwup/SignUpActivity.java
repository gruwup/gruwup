package com.cpen321.gruwup;

import static com.cpen321.gruwup.ProfileFragment.verifyUserInput;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

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
    static final String TAG = "SignUpActivity";
    private Integer age;
    private GoogleSignInClient mGoogleSignInClient;

    private String address;

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
        address = getString(R.string.connection_address);
        // Note: get stores UserID this way for activity
        String UserID = SupportSharedPreferences.getUserId(getApplicationContext());

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

        EditText ageInput = (EditText) findViewById(R.id.setAge);
        TextView ageValidation  = (TextView) findViewById(R.id.setAgeAlert);
        age = 0;

        setProfileBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!verifyUserInput(bioInput).equals("valid")){
                    bioValidation.setText(verifyUserInput(bioInput));
                }
                else if (!isStringInt(ageInput.getText().toString())){
                    ageValidation.setText("Input valid number. ");
                }
                else if (Integer.parseInt(ageInput.getText().toString())<18){
                    ageValidation.setText("You must be over 18 to use the app :( ");
                    new CountDownTimer(2000, 1000) {
                        @Override
                        public void onTick(long millisUntilFinished) {
                        }

                        @Override
                        public void onFinish() {
                            mGoogleSignInClient = GoogleSignIn.getClient(SignUpActivity.this, GoogleSignInOptions.DEFAULT_SIGN_IN);
                            mGoogleSignInClient.signOut();
                            Intent intent = new Intent(SignUpActivity.this, LogInActivity.class);
                            startActivity(intent);
                        }
                    }.start();
                }
                else if(adapter.getSelectedCategoriesCount()<3){
                    categoryValidation.setText("Please select at least 3 categories.");
                }
                else {
                    for (int i = 0 ; i < adapter.getSelectedCategoriesCount(); i++){
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }

                    String displayName = getIntent().getStringExtra("Display_Name");
                    String profileUrl = getIntent().getStringExtra("Photo_URL");

                    try {
                        createProfileRequest(UserID, displayName, profileUrl,bioInput.getText().toString(),mSelectedCategoryNames);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    Intent intent = new Intent(SignUpActivity.this, MainActivity.class);
                    Bundle extras = new Bundle();
                    extras.putString("Display_Name", displayName);
                    extras.putString("Photo_URL", profileUrl);
                    extras.putString("User_ID", UserID);
                    intent.putExtras(extras);
                    startActivity(intent);
                }
            }
        });
    }

    public boolean isStringInt(String s)
    {
        try {
            Integer.parseInt(s);
            return true;
        }
        catch (NumberFormatException ex) {
            return false;
        }
    }

    private void createProfileRequest( String UserID, String displayName, String profileUrl, String bioInput, ArrayList<String> categoryNames) throws IOException {
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

        String cookie = SupportSharedPreferences.getCookie(getApplicationContext());

        SupportRequests.postWithCookie("http://"+address+":8081/user/profile/create", jsonObject.toString(), cookie,new Callback() {
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

}