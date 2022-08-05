package com.cpen321.gruwup;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.EditText;

import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.GrantPermissionRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiSelector;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.regex.Pattern;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class LoginTest {

    UiDevice mUiDevice;

    @Rule
    public ActivityScenarioRule<LogInActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(LogInActivity.class);

    @Rule
    public GrantPermissionRule mGrantPermissionRule =
            GrantPermissionRule.grant(
                    "android.permission.ACCESS_FINE_LOCATION",
                    "android.permission.ACCESS_COARSE_LOCATION",
                    "android.permission.INTERNET",
                    "android.permission.ACCESS_WIFI_STATE");

    @Before
    public void before() throws Exception {
        mUiDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }


    @Test
    public void loginTestNoAccounts() throws Exception {
        ViewInteraction hj = onView(
                allOf(withText("Sign in"),
                        childAtPosition(
                                allOf(withId(R.id.sign_in_button),
                                        childAtPosition(
                                                withClassName(is("androidx.constraintlayout.widget.ConstraintLayout")),
                                                0)),
                                0),
                        isDisplayed()));

        hj.perform(click());

        final UiDevice mDevice=
                UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        final int timeOut = 1000 * 60;

        // Set Login
        UiObject emailInput = mDevice.findObject(new UiSelector()
                .instance(0)
                .className(EditText.class));

        emailInput.waitForExists(timeOut);
        emailInput.setText("gruwupinc@gmail.com");

        UiObject mText = mUiDevice.findObject(new UiSelector().textStartsWith("Next"));
        mText.waitForExists(timeOut);
        mText.click();

//        // Confirm Button Click
//        UiObject next = mDevice.findObject(new UiSelector()
//                .resourceId("identifierNext"));
//        next.waitForExists(timeOut);
//        next.click();

        // Set Password
        UiObject passwordInput = mDevice.findObject(new UiSelector()
                .resourceId("password"));

        passwordInput.waitForExists(timeOut);
        passwordInput.legacySetText("cpen321gruwup");

        // Confirm Button Click
//        UiObject next = mDevice.findObject(new UiSelector()
//                .resourceId("passwordNext"));
//        next.waitForExists(timeOut);
//        next.click();

//        Pattern patternToMatch2 = Pattern.compile("NEXT", Pattern.CASE_INSENSITIVE);
////        device.wait(Until.findObjects(By.text(patternToMatch)),4000);
//
////        UiObject pText = mUiDevice.findObject(new UiSelector().text("NEXT"));
//        UiObject2 pText = mUiDevice.findObject(By.text(patternToMatch2));
//        pText.click();

        UiObject nText = mUiDevice.findObject(new UiSelector().textStartsWith("Next"));
        nText.waitForExists(timeOut);
        nText.click();

        UiObject agreeButton = mUiDevice.findObject(new UiSelector().text("I agree"));
        agreeButton.waitForExists(timeOut);
        agreeButton.click();

        UiObject moreButton = mUiDevice.findObject(new UiSelector().text("MORE"));
        moreButton.waitForExists(timeOut);
        moreButton.click();

        UiObject acceptButton = mUiDevice.findObject(new UiSelector().text("ACCEPT"));
        acceptButton.waitForExists(timeOut);
        acceptButton.click();

    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
