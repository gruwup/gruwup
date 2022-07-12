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
    private RequestViewAdapter adapter;
    private TextView requestList;

    private void initRequestData() throws IOException {
        this.getAllRequests();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_requests, container, false);

        try {
            initRequestData();
            adapter = new RequestViewAdapter(getActivity(),requests);
            RecyclerView requestView = (RecyclerView) view.findViewById(R.id.getRequestView);
            requestView.setLayoutManager(new LinearLayoutManager(getActivity()));
            requestView.setAdapter(adapter);
            requestList = view.findViewById(R.id.requestList);

            requestList.setVisibility(View.GONE);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return view;

    }


    private void getAllRequests() throws IOException {
        String UserID = SupportSharedPreferences.getUserId(this.getActivity());
        String cookie = SupportSharedPreferences.getCookie(this.getActivity());
        Log.d(TAG, "User Id is "+ UserID);
        SupportRequests.getWithCookie("http://"+address+":8081/user/request/" + UserID + "/get-requests", cookie, new Callback() {

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
                        JSONObject jsonObj = new JSONObject(jsonData);
                        JSONArray requestArray = jsonObj.getJSONArray("requests");
                        JSONObject requestObj = new JSONObject();

                        if (requestArray !=null){
                            for (int i=0; i<requestArray.length(); i++){
                                requestObj = requestArray.getJSONObject(i);
                                Log.d(TAG, requestObj.toString());
                                String adventureName = requestObj.getString("adventureTitle");
                                String requesterName = requestObj.getString("requester");
                                String requesterId = requestObj.getString("requesterId");
                                String requestId = requestObj.getString("_id");
                                String status = requestObj.getString("status");
                                String adventureOwner = requestObj.getString("adventureOwner");

                                getActivity().runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        Request request = new Request(adventureName,requesterName,requesterId, requestId, status);
                                        if (request.getStatus().equals("PENDING") && UserID.equals(adventureOwner)){
                                            requests.add(request);
                                            adapter.notifyDataSetChanged();
                                            if (adapter.getItemCount()==0){
                                                requestList.setVisibility(View.VISIBLE);
                                            }
                                            else {
                                                requestList.setVisibility(View.GONE);
                                            }
                                        }
                                        else {
                                            if (adapter.getItemCount()==0){
                                                requestList.setVisibility(View.VISIBLE);
                                            }
                                        }
                                    }
                                });

                            }
                        } else{
                            if (adapter.getItemCount()==0){
                                requestList.setVisibility(View.VISIBLE);
                            }
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }
                else {
                    if (adapter.getItemCount()==0){
                        requestList.setVisibility(View.VISIBLE);
                    }
                    else {
                        requestList.setVisibility(View.GONE);
                    }
                    Log.d(TAG, "get profile is unsuccessful");
                    Log.d(TAG, response.body().string());
                }
            }
        });

    }

}
