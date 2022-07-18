package com.cpen321.gruwup;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.openActionBarOverflowOrOptionsMenu;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDescendantOfA;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isRoot;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.core.AllOf.allOf;
import static org.hamcrest.core.AnyOf.anyOf;


import android.app.Activity;
import android.view.View;

import androidx.test.InstrumentationRegistry;
import androidx.test.espresso.action.ViewActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.filters.LargeTest;
import androidx.test.runner.AndroidJUnit4;

import org.hamcrest.Matcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class ProfileTestBackUp {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);


    // Test for create adventure
    @Test
    public void createAdventure() {
        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
//        onView(withId(R.id.create_adventure)).perform(click());

    }

//    @Before
//    public void setUpFragment(){
//        activityRule.getActivity()
//                .getFragmentManager().beginTransaction()
//    }

    @Test
    public void editProfile(){

        // trying to click nav bar, gives the error:

//        onView(isRoot()).perform(ViewActions.pressMenuKey());
//        onView(withId(R.id.bottom_navigation)).perform(NavigationViewActions.navigateTo(R.id.nav_profile));
//        onView(withText("Discover")).perform(click());


//        onView().perform(click());

//          onView(withText("Sijan")).check(matches(isDisplayed()));
//        onView(withId(R.id.nav_profile))
//                .check(matches(withText("Profile")));
//        onView(allOf( withText("Profile"), isDescendantOfA(withId(R.id.bottom_navigation)))).perform(click());

//        onView(allOf( withText("Profile"), withId(R.id.nav_profile), isDescendantOfA(withId(R.id.bottom_navigation)))).perform(click());

//
//        try {
//            openActionBarOverflowOrOptionsMenu(InstrumentationRegistry.getTargetContext());
//        } catch (Exception e) {
//        }
//        onView(allOf(withText("Profile"), withId(R.id.nav_profile))).perform(click());
//        onView(allOf(withText("Profile"))).perform(click());


//        openActionBarOverflowOrOptionsMenu(InstrumentationRegistry.getTargetContext());
//        onView(withId(R.id.nav_profile)).perform(click());
//        onView(allOf(withId(R.id.userName),withId(R.id.edit_profile_button))).perform(click());
//        onView(withId(R.id.bottom_navigation))
//                .perform(NavigationViewActions.navigateTo(R.id.nav_profile));
//        onView(withId(R.id.nav_profile)).perform(click());
//        onView(withId(R.id.edit_profile_button)).perform(click());
//        onView(withText("Biography")).check(matches(isDisplayed()));
    }
}
