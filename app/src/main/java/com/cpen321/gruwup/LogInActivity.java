package com.cpen321.gruwup;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LogInActivity extends AppCompatActivity {
    private GoogleSignInClient mGoogleSignInClient;
    private int RC_SIGN_IN = 1;
    final static String TAG = "LogInActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);
        getSupportActionBar().hide();

        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.default_web_client_id))
                .requestEmail()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        findViewById(R.id.sign_in_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signIn();
            }
        });

        // TO DO : Add Use without SignIn Option to be able to go to MainActivity without
        // sign in
    }

    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);

            // Signed in successfully, show authenticated UI.
            updateUI(account);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
            updateUI(null);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        updateUI(account);
    }

    private void updateUI(GoogleSignInAccount account) {
        if (account == null){
            Log.d(TAG, "There is no user signed in");
        }
        else{
            // TO DO:  navigate to MainActivity with User Profile Information Passed In

            Log.d(TAG, "Display Name: " + account.getDisplayName());
            Log.d(TAG, "Email: " + account.getEmail());
            Log.d(TAG, "Given Name: "+ account.getGivenName());
            Log.d(TAG, "Family Name: "+ account.getFamilyName());
            Log.d(TAG, "Photo URL: "+ account.getPhotoUrl());
            Log.d(TAG, "Token: " + account.getIdToken());


            String imageUrl = "";

            if (account.getPhotoUrl() != null){
                imageUrl = account.getPhotoUrl().toString();
            }

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("authentication_code", account.getIdToken());
            } catch (JSONException e) {
                e.printStackTrace();
            }

            //TO DO: change this to remote server url // checking if new user
            String finalImageUrl = imageUrl;
            post("http://10.0.2.2:8081/account/sign-in", jsonObject.toString(), new Callback(){
                        @Override
                        public void onFailure(Call call, IOException e) {
                            Log.d(TAG, "login unsucessful");
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            Log.d(TAG, "login successful");

                            String jsonData = response.body().string();
//                            JSONObject jsonObj = null;
                            try {
                                Log.d(TAG, "response body is "+ jsonData);
                                JSONObject jsonObj = new JSONObject(jsonData);
                                Log.d(TAG, "json Obj "+ jsonObj.toString());
                                boolean userExists = jsonObj.getBoolean("userExists");
                                Log.d(TAG, "User exits: "+ userExists);

                                if (!userExists){
                                    Intent intent = new Intent(LogInActivity.this, SignUpActivity.class);
                                    Bundle extras = new Bundle();
                                    extras.putString("Display_Name", account.getDisplayName() );
                                    extras.putString("Photo_URL", finalImageUrl);
                                    intent.putExtras(extras);
                                    startActivity(intent);

                                }
                                else{
                                    Log.d(TAG, "New User!");
                                    Intent intent = new Intent(LogInActivity.this, MainActivity.class);
                                    Bundle extras = new Bundle();
                                    extras.putString("Display_Name", account.getDisplayName() );
                                    extras.putString("Photo_URL", finalImageUrl);
                                    intent.putExtras(extras);
                                    startActivity(intent);
                                }

                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
            });


        }

    }

    OkHttpClient client = new OkHttpClient();
    MediaType JSON = MediaType.parse("application/json");

     Call post(String url , String json , Callback callback){ //should probably make this a static method for code reuse, just pass in client
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