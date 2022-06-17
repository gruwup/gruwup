package com.cpen321.gruwup;

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

import org.json.JSONException;

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

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class DiscoverFragment extends Fragment {

    ArrayList<String> mAdventureList;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
//        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
//        StrictMode.setThreadPolicy(policy);
        View view = inflater.inflate(R.layout.fragment_discover, container, false);
        initAdventures();
        LinearLayoutManager layoutManager = new LinearLayoutManager(view.getContext());
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(),mAdventureList);
        adventureListView.setAdapter(adapter);

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://20.227.142.169:8081/")
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                System.out.println("Request failed");
            }
            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                try {
                    String responseData = response.body().string();
                    System.out.println(responseData);
                } catch (Exception e) {

                }
            }
        });
//        DownloadTask test = new DownloadTask();
//        String url2 = "http://20.227.142.169:8081/";
//        System.out.println("result " + test.execute(url2) + "\n");
//        try {
//            URL url = new URL(url2);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setReadTimeout(10000 /* milliseconds */);
//            conn.setConnectTimeout(15000 /* milliseconds */);
//            conn.setRequestMethod("GET");
//            conn.setDoInput(true);
//            conn.connect();
//            int response = conn.getResponseCode();
//            InputStream is = conn.getInputStream();
//            System.out.println(convertInputStreamToString(is, 500));
//        } catch (ProtocolException e) {
//            e.printStackTrace();
//        } catch (MalformedURLException e) {
//            e.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return view;
    }

    private void showAdventures() {

    }

    private void initAdventures() {
        mAdventureList = new ArrayList<>();
        mAdventureList.add("Movies");
        mAdventureList.add("Sports");
        mAdventureList.add("Games");
        mAdventureList.add("A");
        mAdventureList.add("B");
        mAdventureList.add("C");
        mAdventureList.add("D");
        mAdventureList.add("E");
        mAdventureList.add("F");
        mAdventureList.add("G");
        mAdventureList.add("H");
        mAdventureList.add("I");
    }

    private void asyncHttpRequester(Request request, String result) {
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

//    class requestInfo extends AsyncTask<Void,Void,Void>
//    {
//        protected void onPreExecute() {
//            //display progress dialog.
//        }
//
//        protected Void doInBackground(Void... params) {
//            try {
//                URL urlAddr = new URL("http://20.151.112.63:8081/ipaddress");
//                HttpURLConnection urlConnectionAddr = (HttpURLConnection) urlAddr.openConnection();
//                InputStream inputStreamAddr = urlConnectionAddr.getInputStream();
//                InputStreamReader inputStreamReaderAddr = new InputStreamReader(inputStreamAddr);
//                BufferedReader bufferedReaderAddr = new BufferedReader(inputStreamReaderAddr);
//                String addr = bufferedReaderAddr.readLine();
//                System.out.println(addr);
//                urlConnectionAddr.disconnect();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//            return null;
//        }
//
//        protected void onPostExecute(Void result) {
//            // dismiss progress dialog and update ui
//        }
//    }
//
//    private class DownloadTask extends AsyncTask<String, Void, String> {
//
//        @Override
//        protected String doInBackground(String... params) {
//            //do your request in here so that you don't interrupt the UI thread
//            try {
//                return downloadContent(params[0]);
//            } catch (IOException e) {
//                return "Unable to retrieve data. URL may be invalid.";
//            }
//        }
//
//        @Override
//        protected void onPostExecute(String result) {
//            //Here you are done with the task
//        }
//    }
//
//    private String downloadContent(String myurl) throws IOException {
//        InputStream is = null;
//        int length = 500;
//
//        try {
//            URL url = new URL(myurl);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setReadTimeout(10000 /* milliseconds */);
//            conn.setConnectTimeout(15000 /* milliseconds */);
//            conn.setRequestMethod("GET");
//            conn.setDoInput(true);
//            conn.connect();
//            int response = conn.getResponseCode();
//            is = conn.getInputStream();
//
//            // Convert the InputStream into a string
//            String contentAsString = convertInputStreamToString(is, length);
//            System.out.println(contentAsString);
//            return contentAsString;
//        } finally {
//            if (is != null) {
//                is.close();
//            }
//        }
//    }
//
//    public String convertInputStreamToString(InputStream stream, int length) throws IOException, UnsupportedEncodingException {
//        Reader reader = null;
//        reader = new InputStreamReader(stream, "UTF-8");
//        char[] buffer = new char[length];
//        reader.read(buffer);
//        return new String(buffer);
//    }


}
