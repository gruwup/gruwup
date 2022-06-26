package com.cpen321.gruwup;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class SupportRequests {

    static OkHttpClient client = new OkHttpClient();
    static MediaType JSON = MediaType.parse("application/json");


    public static Call get(String url , Callback callback){
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
        Request request = new Request.Builder()
                .addHeader("Set-Cookie", cookie)
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
