package com.cpen321.gruwup;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class MapViewFragment extends Fragment implements GoogleMap.OnMarkerClickListener {

    MapView mMapView;
    JSONArray HTTP_RESPONSE_ARRAY;

    String address;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        address = getActivity().getString(R.string.connection_address);
        View rootView = inflater.inflate(R.layout.location_fragment, container, false);
        Bundle locationArgs = getArguments();
        String address = locationArgs.getString("address", "");
        String location_address = locationArgs.getString("adventures", "");
        mMapView = (MapView) rootView.findViewById(R.id.mapView);
        mMapView.onCreate(savedInstanceState);

        mMapView.onResume(); // needed to get the map to display immediately

        try {
            MapsInitializer.initialize(getActivity().getApplicationContext());
        } catch (Exception e) {
            e.printStackTrace();
        }

        mMapView.getMapAsync(new OnMapReadyCallback() {
            @SuppressLint("MissingPermission") //should already have all permissions
            @Override
            public void onMapReady(GoogleMap mMap) {
                GoogleMap googleMap;
                googleMap = mMap;
                googleMap.setOnMarkerClickListener(MapViewFragment.this);
                if(!location_address.equals("")) {
                    System.out.println("special mode");
                    try {
                        JSONArray jsonArray = new JSONArray(location_address);
                        HTTP_RESPONSE_ARRAY = jsonArray;
                        for(int i = 0; i < jsonArray.length(); i++) {
                            JSONObject jsonObject = (JSONObject) jsonArray.getJSONObject(i);
                            LatLng test = getLocationFromAddress(getActivity(), jsonObject.getString("location"));
                            googleMap.addMarker(new MarkerOptions().position(test).title(jsonObject.getString("title"))).setTag(jsonObject.getString("_id"));
                        }
                        if(jsonArray.length() > 0) {
                            JSONObject jsonObject = (JSONObject) jsonArray.getJSONObject(0);
                            LatLng test = getLocationFromAddress(getActivity(), jsonObject.getString("location"));
                            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(test, 10));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                else {
                    System.out.println("normal mode");
                    LatLng eventLocation = getLocationFromAddress(getActivity(), address);
                    googleMap.addMarker(new MarkerOptions().position(eventLocation).title("Event title"));
                    CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLngZoom(eventLocation, 12);
                    googleMap.animateCamera(cameraUpdate);
                }
                //Zoom or center to a marker
            }
        });
        return rootView;
    }

    public LatLng getLocationFromAddress(Context context, String strAddress) {
        Geocoder coder = new Geocoder(context);
        List<Address> address;
        LatLng p1 = null;

        try {
            address = coder.getFromLocationName(strAddress, 5);
            if (address == null) {
                return null;
            }
            Address location = address.get(0);
            p1 = new LatLng(location.getLatitude(), location.getLongitude() );
        } catch (IOException ex) {
            ex.printStackTrace();
        }

        return p1;
    }

    @Override
    public void onResume() {
        super.onResume();
        mMapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mMapView.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mMapView.onLowMemory();
    }

    @Override
    public boolean onMarkerClick(Marker marker) {
        System.out.println("Marker clicked!");
        if(HTTP_RESPONSE_ARRAY == null) return true;
        final Dialog dialog = new Dialog(getActivity());
        Button requestToJoin;
        Button viewOnGoogleMaps;
        TextView cancel;
        TextView eventType;
        TextView eventTitle;
        TextView eventDescription;
        TextView eventLocation;
        TextView eventTime;
        TextView eventMemberCount;

        dialog.setContentView(R.layout.view_adventure_pop_up);
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();

        eventType = dialog.findViewById(R.id.view_adventure_event_type);
        eventTitle = dialog.findViewById(R.id.view_adventure_event_title);
        eventDescription = dialog.findViewById(R.id.view_adventure_description);
        eventLocation = dialog.findViewById(R.id.view_adventure_location);
        eventTime = dialog.findViewById(R.id.view_adventure_time);
        eventMemberCount = dialog.findViewById(R.id.view_adventure_member_count);
        requestToJoin = dialog.findViewById(R.id.request_join_adventure);
        viewOnGoogleMaps = dialog.findViewById(R.id.adventure_open_in_maps);
        viewOnGoogleMaps.setVisibility(View.GONE);
        cancel = (TextView) dialog.findViewById(R.id.cancel_view_adventure);
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        String id;
        JSONObject jsonObject = null;
        for(int i = 0; i < HTTP_RESPONSE_ARRAY.length(); i++) {
            try {
                jsonObject = (JSONObject) HTTP_RESPONSE_ARRAY.getJSONObject(i);
                if(jsonObject.getString("_id").equals(marker.getTag())) {
                    break;
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        try {
            eventType.setText(jsonObject.getString("category"));
            eventTitle.setText(jsonObject.getString("title"));
            eventDescription.setText(jsonObject.getString("description"));
            eventLocation.setText(jsonObject.getString("location"));
            eventMemberCount.setText(String.valueOf((new JSONArray(jsonObject.getString("peopleGoing"))).length()));
            eventTime.setText(DiscoverFragment.epochToDate(String.valueOf(jsonObject.getString("dateTime"))));
            id = jsonObject.getString("_id");
        } catch (JSONException e) {
            e.printStackTrace();
            return false;
        }

        JSONObject toPostObject = new JSONObject();
        try {
            toPostObject.put("userName", SharedPreferencesUtil.getUserName(getContext()));
            toPostObject.put("userId", SharedPreferencesUtil.getUserId(getContext()));
            toPostObject.put("dateTime", Long.valueOf(System.currentTimeMillis()));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        requestToJoin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RequestsUtil.postWithCookie("http://" + address + ":8081/user/request/" + id + "/send-request", toPostObject.toString(), SharedPreferencesUtil.getCookie(getActivity()), new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        System.out.println("HTTP req failed inside map fragment");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        if (!response.isSuccessful()) {
                            new Handler(Looper.getMainLooper()).post(new Runnable() {
                                @Override
                                public void run() {
                                    try {
                                        Toast.makeText(getContext(), response.body().string(), Toast.LENGTH_SHORT).show();
                                    } catch (IOException e) {
                                        e.printStackTrace();
                                    }
                                }
                            });
                        }
                        else {
                            Toast.makeText(getContext(), "Request Sent!", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
                dialog.dismiss();
            }
        });

        return true;
    }
}