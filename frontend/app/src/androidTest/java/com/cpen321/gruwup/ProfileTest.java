package com.cpen321.gruwup;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isRoot;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import android.content.Context;

import androidx.test.espresso.action.ViewActions;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.*;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ProfileTest {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void manageProfile() {
        onView(withText("Choose and Create Adventures!")).check(matches(isDisplayed()));
        // click on profile nav bar
        onView((withId(R.id.nav_profile))).check(matches(isDisplayed())).perform(click());
        //default userName and biography without google sign in
        onView(withText("User name")).check(matches(isDisplayed()));
        onView(withText("Biography")).check(matches(isDisplayed()));
        // click on edit profile
        onView((withId(R.id.edit_profile_button))).check(matches(isDisplayed())).perform(click());
        // go back
        onView((withId(R.id.goBack))).check(matches(isDisplayed())).perform(click());
        onView(withText("User name")).check(matches(isDisplayed()));
        // to do :check why bio changes here
        // click on edit again
        onView((withId(R.id.edit_profile_button))).check(matches(isDisplayed())).perform(click());

    }
}

