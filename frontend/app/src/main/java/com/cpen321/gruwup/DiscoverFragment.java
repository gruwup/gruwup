package com.cpen321.gruwup;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.provider.MediaStore;
import android.util.Base64;
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

import com.airbnb.lottie.LottieAnimationView;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.widget.Autocomplete;
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
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
import okhttp3.Response;

public class DiscoverFragment extends Fragment {

    private String address;
    ArrayList<Map<String, String>> mAdventureList;
    static String HTTPRESULT = "";
    static int GET_FROM_GALLERY = 69;
    EditText location; //need google autocomplete, so made global
    TextView createButton;
    TextView confirmCreateButton;
    TextView cancelCreate;
    TextView noAdventures;
    RecyclerView categoryView;
    Button uploadImage;
    Bitmap imageBMP = null;
    private TextView imageAlert;
    private TextView titleAlert;
    private TextView descriptionAlert;
    private TextView timeAlert;
    private TextView locationAlert;
    private final ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    private final ArrayList<String> mCategoryNames = new ArrayList<>();
    private final Handler mHandler = new Handler(Looper.getMainLooper());

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
        address = getActivity().getString(R.string.connection_address);
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        View view = inflater.inflate(R.layout.fragment_discover, container, false);
        noAdventures = view.findViewById(R.id.noDiscAdventures);
        noAdventures.setVisibility(View.INVISIBLE);
        createButton = view.findViewById(R.id.create_adventure);
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
        RecyclerView adventureListView = view.findViewById(R.id.discoveredAdventures);
        adventureListView.setLayoutManager(layoutManager);
        DiscAdvViewAdapter adapter = new DiscAdvViewAdapter(getActivity(), mAdventureList);
        adventureListView.setAdapter(adapter);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        LottieAnimationView loading = view.findViewById(R.id.loading_animation); //cool loading animation
        loading.setVisibility(View.VISIBLE);
        new CountDownTimer(2000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
            }

            @Override
            public void onFinish() {
                loading.setVisibility(View.GONE);
            }
        }.start();
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
        categoryView = dialog.findViewById(R.id.create_adventure_recycler_view);
        categoryView.setLayoutManager(layoutManager);
        CategoryViewAdapter adapter = new CategoryViewAdapter(getActivity(), mCategoryNames);
        categoryView.setAdapter(adapter);
        cancelCreate = dialog.findViewById(R.id.create_adventure_go_back);
        cancelCreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        Places.initialize(getActivity().getApplicationContext(), getString(R.string.googleAPIKey)); //set up Places API

        title = dialog.findViewById(R.id.create_adventure_title_input);
        description = dialog.findViewById(R.id.create_adventure_description_input);
        time = dialog.findViewById(R.id.create_adventure_time_input);
        location = dialog.findViewById(R.id.create_adventure_location_input);

        titleAlert = dialog.findViewById(R.id.setTitleAlert);
        imageAlert = dialog.findViewById(R.id.setImageAlert);
        imageAlert.setText("Image not uploaded yet");
        descriptionAlert = dialog.findViewById(R.id.setDescriptionAlert);
        timeAlert = dialog.findViewById(R.id.setTimeAlert);
        locationAlert = dialog.findViewById(R.id.setLocationAlert);

        location.setFocusable(false);
        location.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                List<Place.Field> fieldList = Arrays.asList(Place.Field.ID, Place.Field.NAME, Place.Field.ADDRESS, Place.Field.LAT_LNG, Place.Field.NAME);
                Intent intent = new Autocomplete.IntentBuilder(AutocompleteActivityMode.OVERLAY, fieldList).build(getActivity());
                startActivityForResult(intent, 100);
            }
        });

        uploadImage = dialog.findViewById(R.id.create_adventure_upload_image_button);
        uploadImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.INTERNAL_CONTENT_URI), GET_FROM_GALLERY);
            }
        });

        confirmCreateButton = dialog.findViewById(R.id.confirmButton);
        confirmCreateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (title.getText().length() > 25) {
                    titleAlert.setText("Title should not be longer than 25 characters");
                } else if (ProfileFragment.verifyUserInput(title) != "valid") {
                    titleAlert.setText("Make sure all fields are not empty and use alphanumeric characters!");
                } else if (ProfileFragment.verifyUserInput(description) != "valid") {
                    titleAlert.setText(null);
                    descriptionAlert.setText("Make sure all fields are not empty and use alphanumeric characters!");
                } else if (ProfileFragment.verifyUserInput(time) != "valid") {
                    titleAlert.setText(null);
                    descriptionAlert.setText(null);
                    timeAlert.setText("Make sure all fields are not empty and use alphanumeric characters!");
                } else if (ProfileFragment.verifyUserInput(location) != "valid") {
                    titleAlert.setText(null);
                    descriptionAlert.setText(null);
                    timeAlert.setText(null);
                    locationAlert.setText("Make sure all fields are not empty and use alphanumeric characters!");
                } else if (imageBMP == null) {
                    titleAlert.setText(null);
                    descriptionAlert.setText(null);
                    timeAlert.setText(null);
                    locationAlert.setText(null);
                    imageAlert.setText("Please choose an image");
                } else if (adapter.getSelectedCategoriesCount() < 1) {
                    titleAlert.setText(null);
                    descriptionAlert.setText(null);
                    timeAlert.setText(null);
                    locationAlert.setText(null);
                    imageAlert.setText(null);
                    Toast.makeText(getActivity(), "Choose at least one activity tag!", Toast.LENGTH_SHORT).show();
                } else if (adapter.getSelectedCategoriesCount() > 1) {
                    titleAlert.setText(null);
                    descriptionAlert.setText(null);
                    timeAlert.setText(null);
                    locationAlert.setText(null);
                    imageAlert.setText(null);
                    Toast.makeText(getActivity(), "Only one activity tag allowed!", Toast.LENGTH_SHORT).show();
                } else {
                    for (int i = 0; i < adapter.getSelectedCategoriesCount(); i++) {
                        mSelectedCategoryNames.add(mCategoryNames.get(adapter.getSelectedCategories().get(i)));
                    }
                    System.out.println(title.getText().toString().trim() + " "
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

                    SupportRequests.postWithCookie("http://" + address + ":8081/user/adventure/create", jsonObject.toString(), SupportSharedPreferences.getCookie(v.getContext()), new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            System.out.println("Failure on post from create adventure");
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            if (response.isSuccessful()) {
                            } else {
                                System.out.println("Failure on response from create adventure: " + response.code() + " " + response.message() + " " + response.body().string() + " ");
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
        if (noAdventures != null) {
            if (arrlen > 0) {
                noAdventures.setVisibility(View.INVISIBLE);
            } else {
                noAdventures.setVisibility(View.VISIBLE);
            }
        }
        for (int i = 0; i < arrlen; i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
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
                if (imageBMP != null) {
                    imageAlert.setTextColor(Color.rgb(0, 204, 0));
                    imageAlert.setText("Image uploaded successfully");
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else if (requestCode == 100 && resultCode == Activity.RESULT_OK) {
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