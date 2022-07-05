package com.cpen321.gruwup;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class RequestsFragment extends Fragment {
    ArrayList<Request> requests = new ArrayList<>();
    static final String TAG = "RequestsFragment";

    // local : "10.0.2.2" , remote: "20.227.142.169"
    private String address = "10.0.2.2";
    //    private String address = "20.227.142.169";

    private void initRequestData() throws IOException {

        this.getAllRequests();
        Request tom = new Request("Movie", "Tom", "116853060753534924974", "22", "PENDING");
        Request dan = new Request("Sport", "Dan", "112559584626040550555", "23", "PENDING");
        requests.add(tom);
        requests.add(dan);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_requests, container, false);

        try {
            initRequestData();
            RequestViewAdapter adapter = new RequestViewAdapter(getActivity(),requests);
            RecyclerView requestView = (RecyclerView) view.findViewById(R.id.getRequestView);
            requestView.setLayoutManager(new LinearLayoutManager(getActivity()));
            requestView.setAdapter(adapter);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return view;

    }


    private void getAllRequests() throws IOException {
        String UserID = SupportSharedPreferences.getUserId(this.getActivity());

        Log.d(TAG, "User Id is "+ UserID);
//        http://localhost:8081/user/request/116853060753534924974/get-requests
        SupportRequests.get("http://"+address+":8081/user/request/" + UserID + "/get-requests", new Callback() {

            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "get request not successful");
                Log.d(TAG, e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "get request successful");
                    String jsonData = response.body().string();

                    try {
                        Log.d(TAG, jsonData);
//                        JSONObject jsonObj = new JSONObject(jsonData);
                        // To do: Parse JSON response of requests from backend here

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }
                else {
                    Log.d(TAG, "get profile is unsuccessful");
                    Log.d(TAG, response.body().string());
                }
            }
        });

    }

}
