package com.cpen321.gruwup;

import static com.airbnb.lottie.network.FileExtension.JSON;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.graphics.Paint;
import android.os.AsyncTask;
import android.os.Bundle;
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
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class DiscoverFragment extends Fragment {

    ArrayList<Map<String, String>> mAdventureList;
    static String HTTPRESULT = "";
    TextView createButton;

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
                createAdventure();
            }
        });

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://20.227.142.169:8081/user/adventure/search/{pagination}")
                .build();

        try {
            Response response = client.newCall(request).execute();
            HTTPRESULT = response.body().string();
            initAdventures();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

        LinearLayoutManager layoutManager = new LinearLayoutManager(view.getContext());
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(),mAdventureList);
        adventureListView.setAdapter(adapter);

        return view;
    }

    private void showAdventures() {

    }

    private void createAdventure() {
        final Dialog dialog = new Dialog(getActivity());
        dialog.setContentView(R.layout.create_adventure_pop_up);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();
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

}
