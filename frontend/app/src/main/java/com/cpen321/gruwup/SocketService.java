package com.cpen321.gruwup;


import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class SocketService extends Service {
    private static final String RECEIVED_MESSAGE = "received";
    private String UserID;
    private String cookie;
    private static String TAG = "SocketService";

    private String address;
    private String serverUrl;


    // socket implementation
    private Socket mSocket;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        address = getApplicationContext().getString(R.string.connection_address);
        serverUrl = "http://" + address + ":8000";
        System.out.println("Service!!!");
        try {
            cookie = SupportSharedPreferences.getCookie(getApplicationContext());
            UserID = SupportSharedPreferences.getUserId(getApplicationContext());
            mSocket = IO.socket(serverUrl);
            mSocket.emit("userInfo", cookie, UserID);
        } catch (URISyntaxException e) {
        }

        mSocket.on("connected", isConnected);
        mSocket.connect();

        return super.onStartCommand(intent, flags, startId);
    }

    private Emitter.Listener isConnected = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            Log.d("SocketService", args[0].toString());
            if (args[0].toString().equals("true")) {
                Log.d(TAG, "===>connected to socket");
                mSocket.on("message", onNewNotification);
            } else {
                Log.d(TAG, "===>cannot connect to socket");
                Log.d(TAG, args[0].toString());
            }
        }
    };

    //Send message to activity
    private void sendMessage(String userName, String message, String dateTime, String adventureId) {
        Intent intent = new Intent("broadcastMsg");
        intent.putExtra("showalert", true);
        intent.putExtra("name", userName);
        intent.putExtra("message", message);
        intent.putExtra("adventureId", adventureId);
        intent.putExtra("dateTime", dateTime);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    private Emitter.Listener onNewNotification = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            JSONObject data = (JSONObject) args[1];

            String userName;
            String message;
            String dateTime;
            String adventureId;

            try {
                adventureId = args[0].toString();
                userName = data.getString("name");
                message = data.getString("message");
                dateTime = data.getString("dateTime");
                sendMessage(userName, message, dateTime, adventureId);
            } catch (JSONException e) {
                return;
            }
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
