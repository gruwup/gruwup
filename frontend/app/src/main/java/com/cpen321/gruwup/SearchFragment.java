package com.cpen321.gruwup;


import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
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
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.riversun.okhttp3.OkHttp3CookieHelper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SearchFragment extends Fragment{
    RecyclerView recyclerView;

    private String address;
    static ArrayList<Map<String, String>> mAdventureList;
    DiscAdvViewAdapter AdventureAdapter;
    String HTTPRESULT = "";
    RecyclerView categoryView;
    Button uploadImage;
    Button filterButton;
    Button nearbyButton;
    EditText searchText;

    TextView cancel;
    TextView noAdventures;
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

    @SuppressLint("MissingPermission")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        address = getActivity().getString(R.string.connection_address);
        LocationListener locationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                //do nothing
            }
        };
        LocationManager locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 10, locationListener);
        Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        String city = getCurrentCity(location);
        System.out.println("city " + city);

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        View view = inflater.inflate(R.layout.fragment_search, container, false);

        noAdventures = view.findViewById(R.id.noSearchAdventures);
        filterButton = (Button) view.findViewById(R.id.filter_button);
        filterButton.setAlpha(0f);
        filterButton.setTranslationY(50);
        filterButton.animate().alpha(1f).translationYBy(-50).setDuration(1500);
        filterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Filter button clicked");
                filterAdventure();
                System.out.println("Update recycler view");
                AdventureAdapter.notifyDataSetChanged();
                updateNoAdventures();
                recyclerView.invalidate();
            }
        });

        searchText = (EditText) view.findViewById(R.id.search_events);
        searchText.setOnKeyListener(new View.OnKeyListener() {
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if ((event.getAction() == KeyEvent.ACTION_DOWN) &&
                        (keyCode == KeyEvent.KEYCODE_ENTER || keyCode == EditorInfo.IME_ACTION_DONE)) {
                    searchAdventure(view);
                }
                return true;
            }
        });

        nearbyButton = (Button) view.findViewById(R.id.nearby_button);
        nearbyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String cookie = SharedPreferencesUtil.getCookie(getActivity());
                String[] cookieList  =  cookie.split("=",2);
                OkHttp3CookieHelper cookieHelper = new OkHttp3CookieHelper();
                cookieHelper.setCookie("http://" + address + ":8081/user/adventure/nearby?city=" + city, cookieList[0], cookieList[1]);
                Request request = new Request.Builder()
                        .url("http://" + address + ":8081/user/adventure/nearby?city="+city)
                        .build();
                OkHttpClient client = new OkHttpClient.Builder()
                        .cookieJar(cookieHelper.cookieJar())
                        .build();
                Call call = client.newCall(request);
                String responseData = "";
                try {
                    Response response = call.execute();
                    responseData = response.body().string();
                    System.out.println("map response data" + responseData);
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }

                AppCompatActivity activity = (AppCompatActivity) DiscAdvViewAdapter.unwrap(view.getContext());
                Fragment mvf = new MapViewFragment();
                Bundle locationArgs = new Bundle();
                locationArgs.putString("adventures", responseData);
                mvf.setArguments(locationArgs);
                activity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, mvf).addToBackStack(null).commit();
            }
        });

        RequestsUtil.getWithCookie("http://" + address + ":8081/user/adventure/nearby?city="+city, SharedPreferencesUtil.getCookie(this.getActivity()), new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                System.out.println("Failed to get adventures in default Search");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    HTTPRESULT = response.body().string();
                    System.out.println("!map response data" + HTTPRESULT);
                    initAdventures();
                    mHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            displayAdventures(view);
                        }
                    });
                } else {
                    System.out.println("HTTP request failed");
                }
            }
        });
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

    private void initAdventures() {
        try {
            mAdventureList = new ArrayList<Map<String, String>>();
            JSONArray jsonArray = new JSONArray(HTTPRESULT);
            int arrlen = jsonArray.length();
            for (int i = 0; i < arrlen; i++) {
                JSONObject jsonObject = (JSONObject) jsonArray.getJSONObject(i);
                mAdventureList.add(new HashMap<String, String>());
                mAdventureList.get(i).put("title", jsonObject.getString("title"));
                mAdventureList.get(i).put("id", jsonObject.getString("_id"));
                mAdventureList.get(i).put("event", jsonObject.getString("category"));
                mAdventureList.get(i).put("time", DiscoverFragment.epochToDate(String.valueOf(jsonObject.getString("dateTime"))));
                mAdventureList.get(i).put("location", jsonObject.getString("location"));
                mAdventureList.get(i).put("count", String.valueOf((new JSONArray(jsonObject.getString("peopleGoing"))).length()));
                mAdventureList.get(i).put("description", jsonObject.getString("description"));
                mAdventureList.get(i).put("image", jsonObject.getString("image"));
            }

            if (getActivity() == null) //can refactor with bottom block
                return;

            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    updateNoAdventures();
                }
            });
        }
        catch (Exception e) {
            System.out.println("A JSON error occurred!");
        }
    }

    private void filterAdventure() {
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
                filterOperation(adapter, numPeople, location, timeSelection, dialog);
            }
        });
    }

    private void filterOperation(CategoryViewAdapter adapter, EditText numPeople, EditText location, RadioGroup timeSelection, Dialog dialog) {
        System.out.println("Apply filters button clicked");
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < adapter.getSelectedCategoriesCount(); i++) {
            mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
            jsonArray.put(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
        }
        if(adapter.getSelectedCategoriesCount() < 1) {
            Toast.makeText(getActivity(), "Choose at least one activity tag!", Toast.LENGTH_SHORT).show();
            return;
        }
        if(numPeople.getText().toString() == null || location.getText().toString() == null || timeSelection.getCheckedRadioButtonId() == -1) {
            Toast.makeText(getActivity(), "Choose a time at least!", Toast.LENGTH_SHORT).show();
            return;
        }
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("categories", jsonArray);
            if(!(numPeople.getText().toString() == null || numPeople.getText().toString().isEmpty())) jsonObject.put("maxPeopleGoing",  Integer.valueOf(numPeople.getText().toString()));
            jsonObject.put("maxTimeStamp", Integer.valueOf(buttonToEpoch(timeSelection.getCheckedRadioButtonId())));
            if(!(location.getText().toString() == null || location.getText().toString().isEmpty())) jsonObject.put("city", location.getText().toString());
        } catch (JSONException e) {
            e.printStackTrace();
            System.out.println("JSON EXCEPTION!!!");
        } catch (Exception e) {
            System.out.println("String Exception! " + numPeople.getText().toString() + " " + location.getText().toString());
        }

        filterSubOperation(jsonObject, dialog);

    }

    private void filterSubOperation(JSONObject jsonObject, Dialog dialog){
        String cookie = SharedPreferencesUtil.getCookie(getActivity());
        String[] cookieList  =  cookie.split("=",2);
        OkHttp3CookieHelper cookieHelper = new OkHttp3CookieHelper();
        cookieHelper.setCookie("http://" + address + ":8081/user/adventure/search-by-filter", cookieList[0], cookieList[1]);
        System.out.println(jsonObject.toString());
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), jsonObject.toString());
        Request request = new Request.Builder()
                .url("http://" + address + ":8081/user/adventure/search-by-filter")
                .post(requestBody)
                .build();
        OkHttpClient client = new OkHttpClient.Builder()
                .cookieJar(cookieHelper.cookieJar())
                .build();
        Call call = client.newCall(request);
        try {
            Response response = call.execute();
            HTTPRESULT = response.body().string();
            System.out.println("HTTP result = " + HTTPRESULT);
            initAdventures();
            AdventureAdapter.notifyDataSetChanged();
            recyclerView.setAdapter(new DiscAdvViewAdapter(getActivity(), mAdventureList));
            recyclerView.invalidate();

        } catch (Exception e) {
            e.printStackTrace();
        }
        AdventureAdapter.notifyDataSetChanged();
        recyclerView.invalidate();
        updateNoAdventures();
        dialog.dismiss();

    }

    private void updateNoAdventures() {
        if(mAdventureList != null) {
            if (mAdventureList.size() > 0) {
                noAdventures.setVisibility(View.INVISIBLE);
            } else {
                noAdventures.setVisibility(View.VISIBLE);
            }
        }
    }

    private void searchAdventure(View view) {
        System.out.println("searching...");
        String search = searchText.getText().toString();
        if (search.length() > 0) {
            RequestsUtil.getWithCookie("http://" + address + ":8081/user/adventure/search-by-title?title=" + search, SharedPreferencesUtil.getCookie(this.getActivity()), new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    System.out.println("Failure in search, by title");
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    if (response.isSuccessful()) {
                        HTTPRESULT = response.body().string();
                        initAdventures();
                        mHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                displayAdventures(view);
                            }
                        });
                    } else {
                        System.out.println("HTTP req failed");
                    }
                }
            });
        }
    }

    private String buttonToEpoch(int buttonId) {
        switch (buttonId) {
            case R.id.todayRadioButton:
                return System.currentTimeMillis() / 1000L + 86400L + "";
            case R.id.weekRadioButton:
                return System.currentTimeMillis() / 1000L + 604800L + "";
            case R.id.monthRadioButton:
                return System.currentTimeMillis() / 1000L + 2628000L + "";
            case R.id.anyRadioButton:
                return Integer.MAX_VALUE + "";
            default:
                return "error"; //should never happen
        }
    }

    private String getCurrentCity(Location location) {
        String city = "";
        try {
            Geocoder gcd = new Geocoder(getActivity(), Locale.getDefault());
            List<Address> addresses = gcd.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            if (addresses.size() > 0) {
                city = addresses.get(0).getLocality();
            }
        } catch (Exception e) {
            city = "Vancouver"; //shouldn't happen
            e.printStackTrace();
        }
        return city;
    }
}