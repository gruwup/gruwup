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
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cpen321.gruwup.R;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.widget.Autocomplete;
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode;

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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DiscoverFragment extends Fragment {
//    private String address = "10.0.2.2";
    private String address = "20.227.142.169";
    ArrayList<Map<String, String>> mAdventureList;
    static String HTTPRESULT = "";
    static int GET_FROM_GALLERY = 69;
    EditText location; //need google autocomplete, so made global
    TextView createButton;
    TextView confirmCreateButton;
    TextView cancelCreate;
    RecyclerView categoryView;
    Button uploadImage;
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
        View view = inflater.inflate(R.layout.fragment_discover, container, false);
        createButton = (TextView) view.findViewById(R.id.create_adventure);
        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("Create adventure button clicked");
                createAdventure(v);
            }
        });

        SupportRequests.getWithCookie("http://" + address + ":8081/user/adventure/" + SupportSharedPreferences.getUserId(this.getActivity()) + "/discover", SupportSharedPreferences.getCookie(this.getActivity()), new Callback() {
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
        RecyclerView adventureListView = (RecyclerView) view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(), mAdventureList);
        adventureListView.setAdapter(adapter);
    }

    private void createAdventure(View v) {
        EditText title;
        EditText description;
        EditText time;
        final Dialog dialog = new Dialog(getActivity());
        dialog.setContentView(R.layout.create_adventure_pop_up);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();
        initCategories();

        LinearLayoutManager layoutManager = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        categoryView = (RecyclerView) dialog.findViewById(R.id.create_adventure_recycler_view);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(), mCategoryNames);
        categoryView.setAdapter(adapter);
        cancelCreate = (TextView) dialog.findViewById(R.id.create_adventure_go_back);
        cancelCreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        Places.initialize(getActivity().getApplicationContext(), "AIzaSyBTzzjkUX-5Snzfhc8JrGn1wA07jgKbluk");

        title = (EditText) dialog.findViewById(R.id.create_adventure_title_input);
        description = (EditText) dialog.findViewById(R.id.create_adventure_description_input);
        time = (EditText) dialog.findViewById(R.id.create_adventure_time_input);
        location = (EditText) dialog.findViewById(R.id.create_adventure_location_input);
        location.setFocusable(false);
        location.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                List<Place.Field> fieldList = Arrays.asList(Place.Field.ID, Place.Field.NAME, Place.Field.ADDRESS, Place.Field.LAT_LNG, Place.Field.NAME);
                Intent intent = new Autocomplete.IntentBuilder(AutocompleteActivityMode.OVERLAY, fieldList).build(getActivity());
                startActivityForResult(intent, 100);
            }
        });

        uploadImage = (Button) dialog.findViewById(R.id.create_adventure_upload_image_button);
        uploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.INTERNAL_CONTENT_URI), GET_FROM_GALLERY);
            }
        });

        confirmCreateButton = (TextView) dialog.findViewById(R.id.confirmButton);
        confirmCreateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ProfileFragment.verifyUserInput(title) != "valid" ||
                        ProfileFragment.verifyUserInput(description) != "valid" ||
                        ProfileFragment.verifyUserInput(time) != "valid" ||
                        ProfileFragment.verifyUserInput(location) != "valid") {
                    Toast.makeText(getActivity(), "Make sure all fields are not empty and use alphanumeric characters!", Toast.LENGTH_SHORT).show();
                } else if (imageBMP == null) {
                    Toast.makeText(getActivity(), "Choose an image!", Toast.LENGTH_SHORT).show();
                } else if (adapter.getSelectedCategoriesCount() < 1) {
                    Toast.makeText(getActivity(), "Choose at least one activity tag!", Toast.LENGTH_SHORT).show();
                } else {
                    for (int i = 0; i < adapter.getSelectedCategoriesCount(); i++) {
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }
                    System.out.println(title.getText().toString().trim() + " " //put the POST here
                            + description.getText().toString().trim() + " "
                            + time.getText().toString().trim() + " "
                            + location.getText().toString().trim() + " " + mSelectedCategoryNames);

                    JSONObject jsonObject = new JSONObject();
                    try {
                        jsonObject.put("owner", SupportSharedPreferences.getUserId(v.getContext().getApplicationContext()));
                        jsonObject.put("title", title.getText().toString().trim());
                        jsonObject.put("description", description.getText().toString().trim());
                        jsonObject.put("dateTime", dateToEpoch(time.getText().toString().trim()));
                        System.out.println(dateToEpoch(time.getText().toString().trim()));
                        jsonObject.put("location", location.getText().toString().trim());
                        jsonObject.put("category", mSelectedCategoryNames.get(0));
                        jsonObject.put("image", bmpToB64(imageBMP));
                    } catch (JSONException e) {
                        e.printStackTrace();
                        System.out.println("JSON EXCEPTION!!!");
                    }

                    // To do: change this later with server url
                    SupportRequests.postWithCookie("http://" + address + ":8081/user/adventure/create", jsonObject.toString(), SupportSharedPreferences.getCookie(v.getContext()), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            System.out.println("failure on post");
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            if (response.isSuccessful()) {
                            } else {
                                System.out.println("failure on response " + response.code() + " " + response.message() + " " + response.body().string() + " ");
                            }
                        }
                    });

                    imageBMP = null; //clear image for next upload
                    dialog.dismiss();
                }
            }
        });
    }

    private void initAdventures() throws JSONException {
        mAdventureList = new ArrayList<Map<String, String>>();
        JSONArray jsonArray = new JSONArray(HTTPRESULT);
        int arrlen = jsonArray.length();
        for (int i = 0; i < arrlen; i++) {
            JSONObject jsonObject = (JSONObject) jsonArray.getJSONObject(i);
            mAdventureList.add(new HashMap<String, String>());
            mAdventureList.get(i).put("title", jsonObject.getString("title"));
            mAdventureList.get(i).put("event", jsonObject.getString("category"));
            mAdventureList.get(i).put("id", jsonObject.getString("_id"));
            mAdventureList.get(i).put("time", epochToDate(jsonObject.getString("dateTime")));
            mAdventureList.get(i).put("location", jsonObject.getString("location"));
            mAdventureList.get(i).put("count", String.valueOf((new JSONArray(jsonObject.getString("peopleGoing"))).length()));
            mAdventureList.get(i).put("description", jsonObject.getString("description"));
            mAdventureList.get(i).put("image", jsonObject.getString("image"));
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
        else if(requestCode == 100 && resultCode == Activity.RESULT_OK) {
            Place place = Autocomplete.getPlaceFromIntent(data);
            location.setText(place.getAddress());
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

    public static String dateToEpoch(String date) {
        try {
            return Long.toString(new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").parse(date).getTime() / 1000);
        } catch (ParseException e) {
            e.printStackTrace();
            return "D2E error!";
        }
    }

    public static String epochToDate(String epoch) {
        try {
            return new SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new Date(Long.parseLong(epoch) * 1000));
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return "E2D error!";
        }
    }
}