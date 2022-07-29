package com.cpen321.gruwup;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

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
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiSelector;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

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
        // Confirm Button Click
        UiObject next = mDevice.findObject(new UiSelector()
                .resourceId("identifierNext"));
        next.waitForExists(timeOut);
        next.click();

        // Set Password
        UiObject passwordInput = mDevice.findObject(new UiSelector()
                .resourceId("password"));

        passwordInput.waitForExists(timeOut);
        passwordInput.legacySetText("cpen321gruwup");

        // Confirm Button Click
        next = mDevice.findObject(new UiSelector()
                .resourceId("passwordNext"));
        next.waitForExists(timeOut);
        next.click();

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


    @Test
    public void loginTestOtherAccountExists() throws Exception {
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

        // check for add account
        UiObject mText = mUiDevice.findObject(new UiSelector().text("Add another account"));
        mText.click();

        final UiDevice mDevice=
                UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        final int timeOut = 1000 * 60;

        // Set Login
        UiObject emailInput = mDevice.findObject(new UiSelector()
                .instance(0)
                .className(EditText.class));

        emailInput.waitForExists(timeOut);
        emailInput.setText("gruwupinc@gmail.com");
        // Confirm Button Click
        UiObject next = mDevice.findObject(new UiSelector()
                .resourceId("identifierNext"));
        next.waitForExists(timeOut);
        next.click();

        // Set Password
        UiObject passwordInput = mDevice.findObject(new UiSelector()
                .resourceId("password"));

        passwordInput.waitForExists(timeOut);
        passwordInput.legacySetText("cpen321gruwup");

        // Confirm Button Click
        next = mDevice.findObject(new UiSelector()
                .resourceId("passwordNext"));
        next.waitForExists(timeOut);
        next.click();

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


    @Test
    public void loginTestUserAccountExists() throws Exception {
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

        // check for gruwup email
        UiObject mText = mUiDevice.findObject(new UiSelector().text("gruwupinc@gmail.com"));
        mText.click();


    }


    @Test
    public void loginTestUserLoggedIn() throws Exception {
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
