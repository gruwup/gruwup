package com.cpen321.gruwup;

import android.app.AlertDialog;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class SocketService extends Service {
    private static final String SENT_MESSAGE = "sent";
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
            Log.d(TAG, "adventure ID=====>" + args[0].toString());
            Log.d(TAG, "message=====>" + args[1].toString());
            JSONObject data = (JSONObject) args[1];

            String userName;
            String userId;
            String message;
            String dateTime;
            // To do: need adventureId?
            String adventureId;
            String messageStatus;

            try {
                adventureId = args[0].toString();
                userName = data.getString("name");
                userId = data.getString("userId");
                message = data.getString("message");
                dateTime = data.getString("dateTime");
                messageStatus = RECEIVED_MESSAGE;
                Message newMessage = new Message(userId, userName, message, dateTime, messageStatus);
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
