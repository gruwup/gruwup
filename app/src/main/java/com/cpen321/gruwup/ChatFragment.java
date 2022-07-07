package com.cpen321.gruwup;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
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

public class ChatFragment extends Fragment {

//    ArrayList <User> users = new ArrayList<>();
    ArrayList <Adventure> adventures = new ArrayList<>();
    private static String TAG = "ChatFragment";
    // local : "10.0.2.2" , remote: "20.227.142.169"
    private String address = "10.0.2.2";
    //    private String address = "20.227.142.169";
    private String cookie;
    private ChatViewAdapter adapter;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_chat, container, false);

        initChatData();
        adapter = new ChatViewAdapter(getActivity(),adventures);
        RecyclerView chatView = (RecyclerView) view.findViewById(R.id.chatView);
        chatView.setLayoutManager(new LinearLayoutManager(getActivity()));
        chatView.setAdapter(adapter);


        return view;
    }

    private void initChatData(){
//        Adventure movie = new Adventure("","Movie Night", "62c65ee5b7831254ed671749","hows it going everyone", "1011", "John");
//        adventures.add(movie);
        getAllChats();
    }

    private void getAllChats() {

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

                    try {
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
