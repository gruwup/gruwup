package com.cpen321.gruwup;

import static com.airbnb.lottie.network.FileExtension.JSON;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Paint;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cpen321.gruwup.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SearchFragment extends Fragment {
    RecyclerView recyclerView;
    private String address = "10.0.2.2";
    static ArrayList<Map<String, String>> mAdventureList;
    DiscAdvViewAdapter AdventureAdapter;
    static String HTTPRESULT = "";
    static int GET_FROM_GALLERY = 69;
    RecyclerView categoryView;
    Button uploadImage;
    Button filterButton;
    EditText searchText;
    TextView cancel;
    Bitmap imageBMP = null;
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private Handler mHandler = new Handler(Looper.getMainLooper());

    private void initCategories() {
        mCategoryNames.add("MOVIE");
        mCategoryNames.add("MUSIC");
        mCategoryNames.add("SPORTS");
        mCategoryNames.add("FOOD");
        mCategoryNames.add("TRAVEL");
        mCategoryNames.add("DANCE");
        mCategoryNames.add("ART");
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        View view = inflater.inflate(R.layout.fragment_search, container, false);

        filterButton = (Button) view.findViewById(R.id.filter_button);
        filterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Filter button clicked");
                filterAdventure(v);
                System.out.println("Update recycler view");
                AdventureAdapter.notifyDataSetChanged();
                recyclerView.invalidate();
            }
        });

        searchText = (EditText) view.findViewById(R.id.search_events);
        searchText.setOnKeyListener(new View.OnKeyListener() {
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                // If the event is a key-down event on the "enter" button
                if (true) {
                    // Perform action on key press
                    System.out.println("Search button clicked");
                    searchAdventure(view);
                    return true;
                }
                return false;
            }
        });

        SupportRequests.get("http://" + address + ":8081/user/adventure/search-by-title?title=test", new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    try {
                        HTTPRESULT = response.body().string();
                        initAdventures();
                        mHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                displayAdventures(view);
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("HTTP req failed");
                }
            }
        });
        displayAdventures(view);
        return view;
    }

    private void displayAdventures(View view) {
        LinearLayoutManager layoutManager = new LinearLayoutManager(view.getContext());
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.searchedAdventures);
        recyclerView = adventureListView;
        adventureListView.setLayoutManager(layoutManager);
        AdventureAdapter = new DiscAdvViewAdapter(getActivity(), mAdventureList);
        adventureListView.setAdapter(AdventureAdapter); //update via global reference
    }

    private void initAdventures() throws JSONException {
        mAdventureList = new ArrayList<Map<String, String>>();
        JSONArray jsonArray = new JSONArray(HTTPRESULT);
        int arrlen = jsonArray.length();
        for (int i = 0; i < arrlen; i++) {
            JSONObject jsonObject = (JSONObject) jsonArray.getJSONObject(i);
            mAdventureList.add(new HashMap<String, String>());
            mAdventureList.get(i).put("event", jsonObject.getString("_id"));
            mAdventureList.get(i).put("time", jsonObject.getString("dateTime"));
            mAdventureList.get(i).put("location", jsonObject.getString("location"));
            mAdventureList.get(i).put("count", String.valueOf((new JSONArray(jsonObject.getString("peopleGoing"))).length()));
            mAdventureList.get(i).put("description", ("Description (currently none) " + String.valueOf(i)));
            mAdventureList.get(i).put("image", jsonObject.getString("image"));
        }
    }

    public void testInitAd() {
        mAdventureList = new ArrayList<Map<String, String>>();
        mAdventureList.add(new HashMap<String, String>());
        mAdventureList.get(0).put("event", "1");
        mAdventureList.get(0).put("time", "12:00");
        mAdventureList.get(0).put("location", "123 Main St");
        mAdventureList.get(0).put("count", "1");
        mAdventureList.get(0).put("description", "Description (currently none) 0");
        mAdventureList.get(0).put("image", "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
        mAdventureList.add(new HashMap<String, String>());
        mAdventureList.get(1).put("event", "2");
        mAdventureList.get(1).put("time", "12:00");
        mAdventureList.get(1).put("location", "123 Main St");
        mAdventureList.get(1).put("count", "1");
        mAdventureList.get(1).put("description", "Description (currently none) 1");
        mAdventureList.get(1).put("image", "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
        mAdventureList.add(new HashMap<String, String>());
        mAdventureList.get(2).put("event", "3");
        mAdventureList.get(2).put("time", "12:00");
        mAdventureList.get(2).put("location", "123 Main St");
        mAdventureList.get(2).put("count", "1");
        mAdventureList.get(2).put("description", "Description (currently none) 2");
        mAdventureList.get(2).put("image", "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
    }

    private void filterAdventure(View view) {
        System.out.println("Filter adventure");
        Button applyFilters;
        EditText location;
        EditText numPeople;
        RadioGroup timeSelection;

        final Dialog dialog = new Dialog(getActivity());
        dialog.setContentView(R.layout.filter_adventure_pop_up);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();
        initCategories();
        cancel = (TextView) dialog.findViewById(R.id.filter_adventure_go_back);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        categoryView = (RecyclerView) dialog.findViewById(R.id.filterAdventureRecycler);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(), mCategoryNames);
        categoryView.setAdapter(adapter);
        location = (EditText) dialog.findViewById(R.id.searchAdventureCity);
        numPeople = (EditText) dialog.findViewById(R.id.searchPeopleCount);
        timeSelection = (RadioGroup) dialog.findViewById(R.id.filter_adventure_time_radio_group);
        applyFilters = (Button) dialog.findViewById(R.id.applyFilterButton);
        applyFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Apply filters button clicked");
                for (int i = 0; i < adapter.getSelectedCategoriesCount(); i++) {
                    mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                }
                System.out.println(location.getText().toString() + " " + numPeople.getText().toString() + " " + timeSelection.getCheckedRadioButtonId() + " " + mSelectedCategoryNames.toString());

                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("category", "[\"MOVIE\"]");
                    jsonObject.put("maxPeopleGoing", "1000");
                    jsonObject.put("maxTimeStamp", "3333333222222");
                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println("JSON EXCEPTION!!!");
                }
                System.out.println(jsonObject.toString());
                RequestBody requestBody = RequestBody.create("application/json", MediaType.parse(jsonObject.toString()));
                Request request = new Request.Builder()
                        .url("http://" + address + ":8081/user/adventure/search-by-filter")
                        .post(requestBody)
                        .build();
                OkHttpClient client = new OkHttpClient();
                Call call = client.newCall(request);
                try {
                    Response response = call.execute();
                    HTTPRESULT = response.body().string();
                    System.out.println("httpresult = " + HTTPRESULT);
                    initAdventures();
                    AdventureAdapter.notifyDataSetChanged();
                    recyclerView.setAdapter(new DiscAdvViewAdapter(getActivity(), mAdventureList));
                    recyclerView.invalidate();
                } catch (Exception e) {
                    e.printStackTrace();
                }
//                mAdventureList.clear();
                AdventureAdapter.notifyDataSetChanged();
                recyclerView.invalidate();

                //update the list of adventures here with REST data
                dialog.dismiss();
                return;
            }
        });
    }

    private void searchAdventure(View view) {
        System.out.println("searching...");
        String search = searchText.getText().toString();
        if (search.length() > 0) {
            SupportRequests.get("http://" + address + ":8081/user/adventure/search-by-title?title=" + search, new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    if (response.isSuccessful()) {
                        try {
                            HTTPRESULT = response.body().string();
                            initAdventures();
                            mHandler.post(new Runnable() {
                                @Override
                                public void run() {
                                    displayAdventures(view);
                                }
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    } else {
                        System.out.println("HTTP req failed");
                    }
                }
            });
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        //Detects request codes
        if (requestCode == GET_FROM_GALLERY && resultCode == Activity.RESULT_OK) {
            Uri selectedImage = data.getData();

            Bitmap bitmap = null;
            try {
                bitmap = MediaStore.Images.Media.getBitmap(this.getActivity().getContentResolver(), selectedImage);
                imageBMP = bitmap;
            } catch (FileNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    public static String bmpToB64(Bitmap bmp) {
        if (bmp == null) return null;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 0, baos);
        byte[] b = baos.toByteArray();
        String imageEncoded = Base64.encodeToString(b, Base64.DEFAULT);
        return (imageEncoded);
    }

    public static Bitmap B64ToBmp(String b64) {
        if (b64 == null) return null;
        byte[] decodedString = Base64.decode(b64, Base64.DEFAULT);
        Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
        return decodedByte;
    }
}