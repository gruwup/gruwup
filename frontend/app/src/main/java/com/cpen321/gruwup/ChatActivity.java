package com.cpen321.gruwup;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.widget.NestedScrollView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class ChatActivity extends AppCompatActivity {

    static final String TAG = "ChatActivity";
    private static final String SENT_MESSAGE = "sent";
    private static final String RECEIVED_MESSAGE = "received";
    private RecyclerView messageRecyclerView;
    private MessageViewAdapter adapter;
    private final ArrayList<Message> messages = new ArrayList<>();

    private EditText editMessageBar;
    private TextView loadOldMessage;
    private String UserID;
    private String UserName;
    private String adventureId;
    private Dialog adventureDialog;
    private String prevPagination = "null";
    private String time;

    private String address;

    private String cookie;

    private JSONArray peopleGoing;
    private String adventureOwner;

    private Socket mSocket;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        address = getString(R.string.connection_address);
        String serverUrl;
        serverUrl = "http://" + address + ":8000";
        setContentView(R.layout.activity_chat);
        getSupportActionBar().hide();

        Intent intent = getIntent();
        String adventureTitle;

        adventureTitle = intent.getStringExtra("name");
        adventureId = intent.getStringExtra("adventureId");

        UserName = SupportSharedPreferences.getUserName(getApplicationContext());
        cookie = SupportSharedPreferences.getCookie(getApplicationContext());
        UserID = SupportSharedPreferences.getUserId(getApplicationContext());

        TextView adventureName = findViewById(R.id.advTitle);
        adventureName.setText(adventureTitle);

        adventureDialog = new Dialog(this);
        ImageView adventureInfo = findViewById(R.id.adventureInfo);
        ImageView adventureEdit = findViewById(R.id.adventureEdit);
        ImageView adventureDelete = findViewById(R.id.adventureDelete);

        adventureInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showDetailPopUp();
            }
        });

        adventureEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getEditAdventureDetails();
            }
        });

        adventureDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                adventureDialog.setContentView(R.layout.adventure_detail_pop_up);
                String cookie = SupportSharedPreferences.getCookie(getApplicationContext());
                SupportRequests.getWithCookie("http://" + address + ":8081/user/adventure/" + adventureId + "/detail", cookie, new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.d(TAG, "Failed to get adventure details");
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if (response.isSuccessful()) {
                            Log.d(TAG, "get profile successful");
                            String jsonData = response.body().string();
                            try {
                                JSONObject jsonObj = new JSONObject(jsonData);
                                adventureOwner = jsonObj.getString("owner");
                                Log.d(TAG, "FOR DELETE UID" + UserID);
                                Log.d(TAG, "FOR DELETE AVID" + adventureOwner);
                                if (UserID.equals(adventureOwner)) {
                                    JSONObject jsonObject = new JSONObject();
                                    Log.d(TAG, "Delete Adventure");
                                    SupportRequests.putWithCookie("http://" + address + ":8081/user/adventure/" + adventureId + "/cancel", jsonObject.toString(), cookie, new Callback() {
                                        @Override
                                        public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                                            if (response.isSuccessful()) {
                                                Log.d(TAG, "Quit adventure succesful");
                                            } else {
                                                Log.d(TAG, "Quit adventure failed" + response);
                                            }
                                        }

                                        @Override
                                        public void onFailure(@NonNull Call call, @NonNull IOException e) {
                                            Log.d(TAG, "Quit adventure failed" + e);
                                        }
                                    });
                                    adventureDialog.dismiss();
                                    finish();
                                } else {
                                    adventureDialog.dismiss();
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            Toast.makeText(getApplicationContext(), "Only adventure creator can cancel an adventure", Toast.LENGTH_LONG).show();
                                        }
                                    });
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        } else {
                            Log.d(TAG, "Failed to get adventure owner");
                        }
                    }
                });

            }
        });

        findViewById(R.id.leaveChat).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        findViewById(R.id.advTitle).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Adventure Title clicked");
            }
        });

        try {
            cookie = SupportSharedPreferences.getCookie(getApplicationContext());
            Log.d("CHAT ", cookie);
            UserID = SupportSharedPreferences.getUserId(getApplicationContext());
            mSocket = IO.socket(serverUrl);
            mSocket.emit("userInfo", cookie, UserID);

        } catch (URISyntaxException e) {
        }

        mSocket.on("connected", isConnected);
        mSocket.connect();

        messageRecyclerView = findViewById(R.id.messageRecyclerView);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        messageRecyclerView.setLayoutManager(linearLayoutManager);

        adapter = new MessageViewAdapter(this, messages);
        messageRecyclerView.setAdapter(adapter);

        String pagination;
        pagination = intent.getStringExtra("dateTime");

        prevPagination = pagination;
        getOldMessages(prevPagination);

        loadOldMessage = findViewById(R.id.loadMessage);
        loadOldMessage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!(("null").equals(prevPagination))) {
                    getOldMessages(prevPagination);
                } else {
                    loadOldMessage.setText("This is start of your conversations");
                }

            }
        });

        UserID = SupportSharedPreferences.getUserId(getApplicationContext());
        UserName = SupportSharedPreferences.getUserName(getApplicationContext());
        editMessageBar = findViewById(R.id.editMesssage);

        Button sendButton;
        sendButton = findViewById(R.id.sendMessage);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String message = editMessageBar.getText().toString().trim();
                if (message != null && !message.isEmpty()) {

                    editMessageBar.setText("");
                    sendChat(message);
                }
            }
        });
    }

    private void getOldMessages(String pagination) {
        cookie = SupportSharedPreferences.getCookie(getApplicationContext());
        SupportRequests.getWithCookie("http://" + address + ":8000/user/chat/" + adventureId + "/messages/" + pagination, cookie, new Callback() {
            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {

                if (response.isSuccessful()) {

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Log.d(TAG, "message history received successfully");
                            try {
                                String jsonData = response.body().string();
                                JSONObject jsonObj = new JSONObject(jsonData);
                                JSONArray messageArray = jsonObj.getJSONArray("messages");
                                prevPagination = jsonObj.getString("prevPagination");
                                JSONObject messageObj = new JSONObject();

                                if (messageArray != null) {
                                    for (int i = messageArray.length() - 1; i >= 0; i--) {
                                        messageObj = messageArray.getJSONObject(i);
                                        String name = messageObj.getString("name");
                                        String userId = messageObj.getString("userId");
                                        String message = messageObj.getString("message");
                                        String dateTime = messageObj.getString("dateTime");
                                        Message oldMessage;

                                        if (UserID.equals(userId)) {
                                            oldMessage = new Message(userId, name, message, dateTime, SENT_MESSAGE);
                                        } else {
                                            oldMessage = new Message(userId, name, message, dateTime, RECEIVED_MESSAGE);
                                        }

                                        Log.d(TAG, ":: " + oldMessage.getMessage());

                                        messages.add(0, oldMessage);
                                        adapter.notifyItemInserted(0);
                                    }
                                }

                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    });

                    for (int i = 0; i < messages.size(); i++) {
                        Log.d(TAG, "> " + messages.get(i).getMessage());
                    }

                } else {
                    Log.d(TAG, "message history failed to load" + response);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            loadOldMessage.setText("");
                        }
                    });
                }
            }

            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to retrieve chat history");
            }
        });
    }

    public void sendChat(String message) {
        long currentTimestamp = System.currentTimeMillis() / 1000;
        Message sendMessage = new Message(UserID, UserName, message, Long.toString(currentTimestamp), SENT_MESSAGE);

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("userId", sendMessage.getUserId());
            jsonObject.put("name", sendMessage.getName());
            jsonObject.put("dateTime", sendMessage.getDateTime());
            jsonObject.put("message", sendMessage.getMessage());

        } catch (JSONException e) {
            e.printStackTrace();
        }

        SupportRequests.postWithCookie("http://" + address + ":8000/user/chat/" + adventureId + "/send", jsonObject.toString(), cookie, new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Could not send message");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            messages.add(sendMessage);
                            adapter.notifyItemInserted(messages.size() - 1);
                            NestedScrollView scrollView = findViewById(R.id.nest);

                            scrollView.smoothScrollTo(0, scrollView.getChildAt(0).getHeight());
                            if (adapter != null) {
                                messageRecyclerView.scrollToPosition(adapter.getItemCount() - 1);
                            }
                            Log.d(TAG, "message sent successfully");
                        }
                    });
                } else {
                    Log.d(TAG, "message failed to send" + response);
                }
            }
        });
    }

    private void showEditPopUp() {
        adventureDialog.setContentView(R.layout.adventure_edit_pop_up);

        getAdventureDetails();
        adventureDialog.show();
        TextView goBack = adventureDialog.findViewById(R.id.go_back_chat);
        TextView category = adventureDialog.findViewById(R.id.view_adventure_event_type);
        TextView adventureTitle = adventureDialog.findViewById(R.id.advTitle);
        TextView location = adventureDialog.findViewById(R.id.view_adventure_location);
        TextView dateTime = adventureDialog.findViewById(R.id.view_adventure_time);
        try {
            time = Long.toString(new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").parse(dateTime.getText().toString()).getTime() / 1000);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        EditText adventureDetail = adventureDialog.findViewById(R.id.adventure_description);
        Button confirmEdit = adventureDialog.findViewById(R.id.confirm_edit_adv);

        confirmEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "Edit adventure");
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("adventureId", adventureId);
                    jsonObject.put("owner", UserID);
                    jsonObject.put("title", adventureTitle.getText().toString());
                    jsonObject.put("description", adventureDetail.getText().toString());
                    jsonObject.put("category", category.getText().toString());
                    jsonObject.put("location", location.getText().toString());
                    jsonObject.put("dateTime", time);
                    jsonObject.put("peopleGoing", peopleGoing);
                    jsonObject.put("status", "OPEN");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                Log.d(TAG, "EDIT ADV" + jsonObject);
                SupportRequests.putWithCookie("http://" + address + ":8081/user/adventure/" + adventureId + "/update", jsonObject.toString(), cookie, new Callback() {
                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if (response.isSuccessful()) {
                            Log.d(TAG, "Edit adventure succesful");
                        } else {
                            Log.d(TAG, "Edit adventure failed" + response);
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.d(TAG, "Edit adventure failed" + e);
                    }
                });
                adventureDialog.dismiss();
            }
        });

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                adventureDialog.dismiss();
            }
        });
    }

    private void showDetailPopUp() {
        adventureDialog.setContentView(R.layout.adventure_detail_pop_up);
        getAdventureDetails();
        adventureDialog.show();
        TextView goBack = adventureDialog.findViewById(R.id.go_back_chat);

        goBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                adventureDialog.dismiss();
            }
        });

    }

    private void getEditAdventureDetails() {

        SupportRequests.getWithCookie("http://" + address + ":8081/user/adventure/" + adventureId + "/detail", cookie, new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to get adventure details");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    Log.d(TAG, "get profile successful");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
                        adventureOwner = jsonObj.getString("owner");

                        Log.d(TAG, "FOR EDIT UID" + UserID);
                        Log.d(TAG, "FOR EDIT AVID" + adventureOwner);
                        if (UserID.equals(adventureOwner)) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    showEditPopUp();
                                }
                            });

                        } else {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(getApplicationContext(), "Only adventure creator can edit an adventure", Toast.LENGTH_LONG).show();
                                }
                            });
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    Log.d(TAG, "Failed to get adventure owner");
                }
            }
        });

    }

    private void getAdventureDetails() {
        String cookie = SupportSharedPreferences.getCookie(getApplicationContext());
        SupportRequests.getWithCookie("http://" + address + ":8081/user/adventure/" + adventureId + "/detail", cookie, new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to get adventure details");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    Log.d(TAG, "get profile successful");
                    String jsonData = response.body().string();

                    try {
                        JSONObject jsonObj = new JSONObject(jsonData);
                        String title = jsonObj.getString("title");
                        String description = jsonObj.getString("description");
                        String eventType = jsonObj.getString("category");
                        Integer memberCount = jsonObj.getJSONArray("peopleGoing").length();
                        String time = jsonObj.getString("dateTime");
                        String location = jsonObj.getString("location");
                        peopleGoing = jsonObj.getJSONArray("peopleGoing");
                        adventureOwner = jsonObj.getString("owner");

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                TextView titleView = adventureDialog.findViewById(R.id.advTitle);
                                titleView.setText(title);

                                TextView typeView = adventureDialog.findViewById(R.id.view_adventure_event_type);
                                typeView.setText(eventType);

                                TextView countView = adventureDialog.findViewById(R.id.view_adventure_member_count);
                                countView.setText(memberCount.toString());

                                TextView timeView = adventureDialog.findViewById(R.id.view_adventure_time);
                                // assuming time is obtained in seconds epoch time
                                Date date = new Date(Long.parseLong(time, 10) * 1000);
                                DateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                                String formatted = format.format(date);
                                formatted = format.format(date);
                                timeView.setText(formatted);

                                TextView locationView = adventureDialog.findViewById(R.id.view_adventure_location);
                                locationView.setText(location);

                                TextView descriptionView = adventureDialog.findViewById(R.id.adventure_description);
                                descriptionView.setText(description);
                            }
                        });

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    Log.d(TAG, "Failed to get adventure details");
                }
            }
        });
    }

    private final Emitter.Listener isConnected = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (args[0].toString().equals("true")) {
                        Log.d(TAG, "===>connected to socket");
                        mSocket.on("message", onNewMessage);
                    } else {
                        Log.d(TAG, "===>cannot connect to socket");
                        Log.d(TAG, args[0].toString());
                    }
                }
            });
        }
    };


    private final Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "adventure ID=====>" + args[0].toString());
                    Log.d(TAG, "message=====>" + args[1].toString());
                    JSONObject data = (JSONObject) args[1];

                    String userName;
                    String userId;
                    String message;
                    String dateTime;
                    String messageStatus;

                    Log.d(TAG, "THIS ADVENTURE ID:" + adventureId);
                    if (adventureId.equals(args[0].toString())) {
                        try {
                            userName = data.getString("name");
                            userId = data.getString("userId");
                            message = data.getString("message");
                            dateTime = data.getString("dateTime");
                            messageStatus = RECEIVED_MESSAGE;
                            Message newMessage = new Message(userId, userName, message, dateTime, messageStatus);
                            messages.add(newMessage);

                            NestedScrollView scrollView = findViewById(R.id.nest);
                            scrollView.smoothScrollTo(0, scrollView.getChildAt(0).getHeight());
                            if (adapter != null) {
                                adapter.notifyItemInserted(messages.size() - 1);
                            }


                        } catch (JSONException e) {
                            return;
                        }
                    }
                }
            });
        }
    };

}