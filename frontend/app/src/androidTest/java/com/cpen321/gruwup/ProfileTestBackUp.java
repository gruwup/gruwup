package com.cpen321.gruwup;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static androidx.test.platform.app.InstrumentationRegistry.getInstrumentation;

import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObjectNotFoundException;
import androidx.test.uiautomator.UiScrollable;
import androidx.test.uiautomator.UiSelector;
import androidx.test.uiautomator.Until;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;


/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ProfileTestBackUp {


    private static final String BASIC_SAMPLE_PACKAGE
            = "com.example.android.testing.uiautomator.BasicSample";
    private static final int LAUNCH_TIMEOUT = 5000;
    private static final String STRING_TO_BE_TYPED = "UiAutomator";
    private UiDevice device;

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);
    @Test
    public void testLogin() throws UiObjectNotFoundException {

        // To do: gruwup app has to be in home here / try from app drawer as well
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        device.pressHome();

// Bring up the default launcher by searching for a UI component
// that matches the content description for the launcher button.
        UiObject allAppsButton = device
                .findObject(new UiSelector().description("gruwup"));

// Perform a click on the button to load the launcher.
        allAppsButton.clickAndWaitForNewWindow();

    }

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

