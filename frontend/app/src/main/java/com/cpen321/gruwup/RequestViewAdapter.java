package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Paint;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class RequestViewAdapter extends RecyclerView.Adapter<RequestViewAdapter.ViewHolder> {

    Context context;
    Dialog requestDialog;
    ArrayList<Request> requests;

    private String address;
    static final String TAG = "RequestViewAdapter";

    public RequestViewAdapter(Context context, ArrayList<Request> requests){
        this.context = context;
        this.requests = requests;
        address = context.getString(R.string.connection_address);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.request_list, parent, false);
        return new RequestViewAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        Request request = requests.get(position);

        holder.requesterName.setText(request.getRequesterName());
        holder.adventureName.setText(request.getAdventureName());
        holder.adventureTitle.setText(request.getAdventureName());

        requestDialog = new Dialog(this.context);
        holder.acceptRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // To do: make backend request , do below if backend request is successful
                showPopUp( "accept",position);
                requests.remove(position);
                notifyItemRemoved(position);
            }
        });

        holder.denyRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // To do: make backend request , do below if backend request is successful
                showPopUp("deny",position);
                requests.remove(position);
                notifyItemRemoved(position);
            }
        });

        holder.requesterName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "clicked on requester name");
                String requesterId = requests.get(position).getRequesterId();
                try {
                    showProfile(requesterId, request.getRequesterName());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

    }

    private void showProfile(String userId, String requesterName) throws IOException {
        requestDialog.setContentView(R.layout.requester_profile_pop_up);
        this.getProfileRequest(userId);
        requestDialog.show();

        TextView closeProfile  = (TextView) requestDialog.findViewById(R.id.close);
        TextView name = (TextView) requestDialog.findViewById(R.id.requesterProfileName);
        name.setText(requesterName);

        closeProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                requestDialog.dismiss();
            }
        });
    }

    private void showPopUp( String action, int position) {
        String cookie = SupportSharedPreferences.getCookie(this.context);
        if (action.equals("accept")){
            String url = "http://"+ address + ":8081/user/request/" + requests.get(position).getRequestId() + "/accept";
            String json = "";
            SupportRequests.putWithCookie(url,json, cookie, new Callback() {
                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    String jsonData = response.body().string();
                    Log.d(TAG, jsonData);
                }

                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    Log.d(TAG, "Accept Request Unsuccessful");
                }
            });
            requestDialog.setContentView(R.layout.accept_request_pop_up);
            requestDialog.show();
        }
        else if (action.equals("deny")){
            String url = "http://"+ address + ":8081/user/request/" + requests.get(position).getRequestId() + "/reject";
            String json = "";
            SupportRequests.putWithCookie(url,json, cookie,new Callback() {
                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    String jsonData = response.body().string();
                    Log.d(TAG, jsonData);
                }

                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    Log.d(TAG, "Reject Request Unsuccessful");
                }
            });
            requestDialog.setContentView(R.layout.deny_request_pop_up);
            requestDialog.show();
        }
        new CountDownTimer(2000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                // Callback fired on regular interval
            }

            @Override
            public void onFinish() {
                requestDialog.dismiss();
                notifyDataSetChanged();

            }
        }.start();
    }

    @Override
    public int getItemCount() {
        return requests.size();
    }

    private void getProfileRequest(String userId) throws IOException {

        String cookie = SupportSharedPreferences.getCookie(this.context);
        SupportRequests.getWithCookie("http://"+address+":8081/user/profile/" + userId + "/get", cookie, new Callback() {

            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "get requester profile not successful");
                Log.d(TAG, e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "get requester profile successful");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
                        Log.d(TAG, "json Obj for requester profile "+ jsonObj.toString());
                        String bio = jsonObj.getString("biography");
                        String image = jsonObj.getString("image");
                        JSONArray pref = jsonObj.getJSONArray("categories");
                        ArrayList<String> preferences_list = new ArrayList<String>();
                        if (pref !=null){
                            for (int i=0; i<pref.length(); i++){
                                preferences_list.add(pref.getString(i));
                            }
                        }

                        Log.d(TAG, "Requester Preferences List: "+ preferences_list);

                        Handler uiHandler = new Handler(Looper.getMainLooper());
                        uiHandler.post(new Runnable(){
                            @Override
                            public void run() {
                                TextView requesterBio = (TextView) requestDialog.findViewById(R.id.requesterBio);
                                RecyclerView requesterPref = (RecyclerView) requestDialog.findViewById(R.id.requesterPreferences);
                                requesterBio.setText(bio);

                                RecyclerView.LayoutManager mLayoutManafer = new LinearLayoutManager(requestDialog.getContext(), LinearLayoutManager.HORIZONTAL, false);
                                requesterPref.setLayoutManager(mLayoutManafer);
                                CategoryViewAdapter adapter = new CategoryViewAdapter(requestDialog.getContext(), preferences_list);
                                requesterPref.setAdapter(adapter);


                                ImageView requesterImg = (ImageView) requestDialog.findViewById(R.id.requesterImage);
                                Picasso.get().load(image).into(requesterImg);
                            }
                        });


                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
                else {
                    Log.d(TAG, "get requester profile is unsuccessful");
                    Log.d(TAG, response.body().string());
                }
            }
        });
    }


    public class ViewHolder extends RecyclerView.ViewHolder{
        TextView requesterName;
        TextView adventureName;
        TextView adventureTitle;
        TextView acceptRequest;
        TextView denyRequest;
        ImageView requesterImage;
        TextView requesterProfileName;
        TextView requesterBio;
        TextView closeProfile;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            requesterName = itemView.findViewById(R.id.requesterName);
            adventureName = itemView.findViewById(R.id.requestAdventureName);
            adventureTitle = itemView.findViewById(R.id.adventureName);
            acceptRequest = itemView.findViewById(R.id.acceptRequest);
            denyRequest = itemView.findViewById(R.id.denyRequest);
            requesterProfileName = itemView.findViewById(R.id.requesterProfileName);
            requesterBio = itemView.findViewById(R.id.requesterBio);
            closeProfile = itemView.findViewById(R.id.close);
            requesterName.setPaintFlags(requesterName.getPaintFlags() |   Paint.UNDERLINE_TEXT_FLAG);
        }
    }
}
