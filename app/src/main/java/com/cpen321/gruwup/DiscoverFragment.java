package com.cpen321.gruwup;

import static com.airbnb.lottie.network.FileExtension.JSON;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.graphics.Paint;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.internal.http2.Http2Reader;

public class DiscoverFragment extends Fragment {

    ArrayList<Map<String, String>> mAdventureList;
    static String HTTPRESULT = "";
    TextView createButton;
    TextView confirmCreateButton;
    TextView cancelCreate;
    RecyclerView categoryView;
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private Handler mHandler = new Handler(Looper.getMainLooper());


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
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        View view = inflater.inflate(R.layout.fragment_discover, container, false);

        createButton = (TextView) view.findViewById(R.id.create_adventure);
        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Create adventure button clicked");
                createAdventure(v);
            }
        });

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://10.0.2.2:8081/user/adventure/search/{pagination}")
                .build();

        try {
            get("http://10.0.2.2:8081/user/adventure/search/{pagination}",  new Callback() {

                @Override
                public void onFailure(Call call, IOException e) {

                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    if(response.isSuccessful()){
                        try {
                           HTTPRESULT = response.body().string();
                           initAdventures();

                           mHandler.post(new Runnable() {
                               @Override
                               public void run() {
                                   displayAdventures(view);
                               }
                           });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    else {
                        System.out.println("HTTP req failed");
                    }
                }
            });
            initAdventures();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        displayAdventures(view);

        return view;
    }

    private void displayAdventures(View view) {
        LinearLayoutManager layoutManager = new LinearLayoutManager(view.getContext());
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(),mAdventureList);
        adventureListView.setAdapter(adapter);
    }

    private void createAdventure(View v) {
        EditText title;
        EditText description;
        EditText time;
        EditText location;

        final Dialog dialog = new Dialog(getActivity());
        dialog.setContentView(R.layout.create_adventure_pop_up);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();

        initCategories();
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        categoryView = (RecyclerView) dialog.findViewById(R.id.create_adventure_recycler_view);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(), mCategoryNames);
        categoryView.setAdapter(adapter);

        cancelCreate = (TextView) dialog.findViewById(R.id.create_adventure_go_back);
        cancelCreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        title = (EditText) dialog.findViewById(R.id.create_adventure_title_input);
        description = (EditText) dialog.findViewById(R.id.create_adventure_description_input);
        time = (EditText) dialog.findViewById(R.id.create_adventure_time_input);
        location = (EditText) dialog.findViewById(R.id.create_adventure_location_input);
        confirmCreateButton = (TextView) dialog.findViewById(R.id.confirmButton);
        confirmCreateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(ProfileFragment.verifyUserInput(title) != "valid" ||
                        ProfileFragment.verifyUserInput(description) != "valid" ||
                        ProfileFragment.verifyUserInput(time) != "valid" ||
                        ProfileFragment.verifyUserInput(location) != "valid"){
                    Toast.makeText(getActivity(), "Make sure all fields are not empty and use alphanumeric characters!", Toast.LENGTH_SHORT).show();
                }
                else {
                    for (int i = 0 ; i < adapter.getSelectedCategoriesCount(); i++) {
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }
                    System.out.println(title.getText().toString().trim() + " "
                            + description.getText().toString().trim() + " "
                            + time.getText().toString().trim() + " "
                            + location.getText().toString().trim() + " " + mSelectedCategoryNames);
                    dialog.dismiss();
                }
            }
        });
    }

    private void initAdventures() throws JSONException {
        mAdventureList = new ArrayList<Map<String, String>>();

        JSONArray jsonArray = new JSONArray(HTTPRESULT);
        int arrlen = jsonArray.length();

        for(int i = 0; i < arrlen; i++){
            JSONObject jsonObject = (JSONObject)jsonArray.getJSONObject(i);
            mAdventureList.add(new HashMap<String, String>());
            mAdventureList.get(i).put("event", jsonObject.getString("id"));
            mAdventureList.get(i).put("time", jsonObject.getString("dateTime"));
            mAdventureList.get(i).put("location", jsonObject.getString("location"));
            mAdventureList.get(i).put("count", ("3"));
            mAdventureList.get(i).put("description", ("Description " + String.valueOf(i)));
        }
    }

    private void asyncHttpRequester(Request request) {
        OkHttpClient client = new OkHttpClient();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                System.out.println("Request failed");
            }
            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                try {
                    String responseData = response.body().string();
                    HTTPRESULT = responseData;
                } catch (Exception e) {

                }
            }
        });
    }

    @Nullable
    private Response syncHttpRequester(Request request) {
        try {
            OkHttpClient client = new OkHttpClient();
            Response response = client.newCall(request).execute();
            return response;
        }
        catch (Exception e) {
            System.out.println("Request failed");
            return null;
        }
    }

    @NonNull
    private Call get(String url , Callback callback){
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();
        OkHttpClient client = new OkHttpClient();
        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }
}
