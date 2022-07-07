package com.cpen321.gruwup;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

public class SupportSharedPreferences {

    static final String TAG = "SharedPreferences";

    public static String getUserId(Context context){
        final String DATA_TAG = "UserId";
        final String PREF_NAME = "LogIn";
        SharedPreferences settings = context.getSharedPreferences(PREF_NAME,0);
        String userID = settings.getString(DATA_TAG, null);
        return userID;
    }

    public static String getCookie(Context context){
        final String COOKIE_TAG = "Cookie";
        final String PREF_NAME = "LogIn";
        SharedPreferences settings = context.getSharedPreferences(PREF_NAME,0);
        String cookie = settings.getString(COOKIE_TAG, null);
        return cookie;
    }

    public static String getUserName(Context context){
        final String USER_NAME = "UserName";
        final String PREF_NAME = "LogIn";
        SharedPreferences settings = context.getSharedPreferences(PREF_NAME,0);
        String cookie = settings.getString(USER_NAME, null);
        return cookie;
    }




}
