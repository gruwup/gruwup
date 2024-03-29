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
    private static String TAG = "SocketService";

    // socket implementation
    private Socket mSocket;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String address;
        String serverUrl;

        address = getApplicationContext().getString(R.string.connection_address);
        serverUrl = "http://" + address + ":8000";
        System.out.println("Service!!!");
        String UserID;
        String cookie;
        try {
            cookie = SharedPreferencesUtil.getCookie(getApplicationContext());
            UserID = SharedPreferencesUtil.getUserId(getApplicationContext());
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
            }
        }
    };

    //Send message to activity
    private void sendMessage(String userName, String message, String dateTime, String adventureId, String adventureName) {
        Intent intent = new Intent("broadcastMsg");
        intent.putExtra("showalert", true);
        intent.putExtra("name", userName);
        intent.putExtra("message", message);
        intent.putExtra("adventureId", adventureId);
        intent.putExtra("dateTime", dateTime);
        intent.putExtra("adventureName", adventureName);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    private Emitter.Listener onNewNotification = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            JSONObject data = (JSONObject) args[2];

            String userName;
            String message;
            String dateTime;
            String adventureId;
            String adventureName;

            try {
                adventureId = args[0].toString();
                adventureName = args[1].toString();
                userName = data.getString("name");
                message = data.getString("message");
                dateTime = String.valueOf(data.getString("dateTime"));
                sendMessage(userName, message, dateTime, adventureId, adventureName);
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
