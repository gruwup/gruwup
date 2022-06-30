package com.cpen321.gruwup;

import android.util.Log;

import org.riversun.okhttp3.OkHttp3CookieHelper;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class SupportRequests {

    static OkHttpClient client = new OkHttpClient();
    static MediaType JSON = MediaType.parse("application/json");
    static String TAG = "SupportRequests";


    public static Call get(String url , Callback callback){
        OkHttpClient client = new OkHttpClient();
        Log.d(TAG, "Get request from "+url);
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }


    public static Call getWithCookie(String url , String cookie, Callback callback){

        // separate to cookie name and value
        // Source: https://stackoverflow.com/questions/35743291/add-cookie-to-client-request-okhttp
        String[] cookieList  =  cookie.split("=",2);
        OkHttp3CookieHelper cookieHelper = new OkHttp3CookieHelper();
        cookieHelper.setCookie(url, cookieList[0], cookieList[1]);

        OkHttpClient client = new OkHttpClient.Builder()
                .cookieJar(cookieHelper.cookieJar())
                .build();

        Log.d(TAG, "Get request from "+url);
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }

    public static Call post(String url , String json , Callback callback){
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }

    public static Call postWithCookie(String url , String json , String cookie, Callback callback){
        RequestBody body = RequestBody.create(JSON, json);

        String[] cookieList  =  cookie.split("=",2);
        OkHttp3CookieHelper cookieHelper = new OkHttp3CookieHelper();
        cookieHelper.setCookie(url, cookieList[0], cookieList[1]);

        OkHttpClient client = new OkHttpClient.Builder()
                .cookieJar(cookieHelper.cookieJar())
                .build();

//        Request request = new Request.Builder()
//                .url(url)
//                .get()
//                .build();
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }

    public static Call put(String url , String json , Callback callback){
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .put(body)
                .build();

        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;

    }
}
