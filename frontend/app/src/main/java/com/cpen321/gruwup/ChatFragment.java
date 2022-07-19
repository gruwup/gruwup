package com.cpen321.gruwup;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
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

public class ChatFragment extends Fragment {

    ArrayList <Adventure> adventures = new ArrayList<>();
    private static String TAG = "ChatFragment";


    private String address;
    private String cookie;
    private ChatViewAdapter adapter;
    private TextView noMessages;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        address = getActivity().getString(R.string.connection_address);
        View view = inflater.inflate(R.layout.fragment_chat, container, false);
        noMessages = view.findViewById(R.id.noMessages);
        adapter = new ChatViewAdapter(getActivity(),adventures);
        RecyclerView chatView = (RecyclerView) view.findViewById(R.id.chatView);
        chatView.setLayoutManager(new LinearLayoutManager(getActivity()));
        chatView.setAdapter(adapter);
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        getAllChats();
        // This registers mMessageReceiver to receive messages.
        LocalBroadcastManager.getInstance(this.getActivity())
                .registerReceiver(mMessageReceiver,
                        new IntentFilter("broadcastMsg"));
    }

    private BroadcastReceiver mMessageReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if(intent.getBooleanExtra("showalert",false))
            {
                String adventureId = intent.getStringExtra("adventureId");
                String lastMessage = intent.getStringExtra("message");
                String lastMessageTime = intent.getStringExtra("dateTime");

                for (int i=0; i<adventures.size(); i++){
                    if (adventures.get(i).getAdventureId().equals(adventureId)){
                        adventures.get(i).setLastMessage(lastMessage);
                        adventures.get(i).setLastMessageTime(lastMessageTime);
                    }
                }
                if(adventures.size()>0) {
                    noMessages.setVisibility(View.GONE);
                }
                else {
                    noMessages.setVisibility(View.VISIBLE);
                }

                adapter.notifyDataSetChanged();
                if(adventures.size()>0) {
                    noMessages.setVisibility(View.INVISIBLE);
                }
                else {
                    noMessages.setVisibility(View.VISIBLE);
                }
            }
        }

    };

    public void getAllChats() {

        String UserID = SupportSharedPreferences.getUserId(this.getActivity());
        Log.d(TAG, "User Id is "+ UserID);
        cookie = SupportSharedPreferences.getCookie(this.getActivity());
        Log.d(TAG, "Cookie is "+cookie);

        SupportRequests.getWithCookie("http://"+address+":8000/user/chat/" + UserID + "/recent-list", cookie, new Callback() {
            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()){
                    Log.d(TAG, "get request successful");
                    String jsonData = response.body().string();

                    if(getActivity() == null)
                        return;

                    try {
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                adventures.clear();
                                adapter.notifyDataSetChanged();
                                if(adventures.size()>0) {
                                    noMessages.setVisibility(View.INVISIBLE);
                                }
                                else {
                                    noMessages.setVisibility(View.VISIBLE);
                                }
                            }
                        });

                        JSONObject jsonObj = new JSONObject(jsonData);
                        JSONArray messageArray = jsonObj.getJSONArray("messages");
                        JSONObject messageObj = new JSONObject();

                        if (messageArray !=null){
                            for (int i=0; i<messageArray.length(); i++){
                                messageObj = messageArray.getJSONObject(i);
                                Log.d(TAG, messageObj.toString());

                                String adventureName = messageObj.getString("adventureTitle");
                                String image = "";
                                String adventureId = messageObj.getString("adventureId");
                                String lastMessage = messageObj.getString("message");
                                String lastMessageTime = messageObj.getString("dateTime");
                                String lastMessageSender = messageObj.getString("name");


                                getActivity().runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        Adventure adventure = new Adventure(image,adventureName,adventureId,lastMessage,lastMessageTime,lastMessageSender);
                                        adventures.add(adventure);
                                        adapter.notifyDataSetChanged();
                                        if(adventures.size()>0) {
                                            noMessages.setVisibility(View.INVISIBLE);
                                        }
                                        else {
                                            noMessages.setVisibility(View.VISIBLE);
                                        }
                                    }
                                });


                            }
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
                else{
                    Log.d(TAG, "get recent chat list unsucessful");
                }

            }

            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "get recent chat list failed "+e);
            }
        });

        }
}
