package com.cpen321.gruwup;

import static com.cpen321.gruwup.ProfileFragment.verifyUserInput;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.util.ArrayList;

public class SignUpActivity extends AppCompatActivity {

    private ArrayList<String> mCategoryNames = new ArrayList<>();
    private ArrayList<String> mSelectedCategoryNames = new ArrayList<>();
    RecyclerView categoryView ;
    RecyclerView selectedCategories ;

    private void initCategories(){
        mCategoryNames.add("MOVIE");
        mCategoryNames.add("MUSIC");
        mCategoryNames.add("SPORTS");
        mCategoryNames.add("FOOD");
        mCategoryNames.add("TRAVEL");
        mCategoryNames.add("DANCE");
        mCategoryNames.add("ART");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
        getSupportActionBar().hide();

        initCategories();
        LinearLayoutManager layoutManager = new LinearLayoutManager(SignUpActivity.this, LinearLayoutManager.HORIZONTAL, false);
        categoryView = (RecyclerView) findViewById(R.id.setUpPreferences);
        categoryView.setLayoutManager(layoutManager);

        CategoryViewAdapter adapter = new CategoryViewAdapter(SignUpActivity.this,mCategoryNames);
        categoryView.setAdapter(adapter);

        EditText bioInput = (EditText) findViewById(R.id.setBio);
        TextView bioValidation = (TextView) findViewById(R.id.setBioAlert);
        TextView categoryValidation = (TextView) findViewById(R.id.selectCategoryAlert);
        Button setProfileBtn = (Button) findViewById(R.id.setupProfileButton);

        setProfileBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!verifyUserInput(bioInput).equals("valid")){
                    bioValidation.setText(verifyUserInput(bioInput));
                }
                else if(adapter.getSelectedCategoriesCount()<3){
                    categoryValidation.setText("Please select at least 3 categories.");
                }
                else {
                    // pass selected categories for creating profile
                }

            }
        });





    }
}