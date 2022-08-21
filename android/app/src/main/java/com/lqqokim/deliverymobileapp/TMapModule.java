package com.lqqokim.deliverymobileapp;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.jetbrains.annotations.NotNull;
import java.util.HashMap;
import com.skt.Tmap.TMapTapi;

public class TMapModule extends ReactContextBaseJavaModule {
    TMapModule(ReactApplicationContext context) {
        super(context);
    }

    @NotNull
    @Override
    public String getName() {
        return "TMap";
    }

    @ReactMethod
    public void openNavi(String name, String longitude, String latitude, String vehicle, Promise promise) {
        TMapTapi tMapTapi = new TMapTapi(getReactApplicationContext());
        tMapTapi.setOnAuthenticationListener(new TMapTapi.OnAuthenticationListenerCallback() {
            @Override
            public void SKTMapApikeySucceed() {
                boolean isTmapApp = tMapTapi.isTmapApplicationInstalled();
                if (isTmapApp) {
                    HashMap pathInfo = new HashMap();
                    pathInfo.put("rGoName", name);
                    pathInfo.put("rGoX", longitude);
                    pathInfo.put("rGoY", latitude);
                    pathInfo.put("rSOpt", vehicle.equals("MOTORCYCLE") ? 6 : 0);

                    boolean result = tMapTapi.invokeRoute(pathInfo);
                    if (result) {
                        promise.resolve(true);
                    } else {
                        promise.resolve(true);
                    }
                } else {
                    promise.resolve(false);
                }
            }

            @Override
            public void SKTMapApikeyFailed(String errorMsg) {
                promise.resolve(false);
            }
        });
        tMapTapi.setSKTMapAuthentication("l7xxc797611346154cf998beea3e1c896753");
        boolean isTmapApp = tMapTapi.isTmapApplicationInstalled();
        if (isTmapApp) {
            boolean result = tMapTapi.invokeNavigate(name, Float.parseFloat(longitude), Float.parseFloat(latitude), 0, false, vehicle.equals("MOTORCYCLE") ? 6 : 0);
            if (result) {
                promise.resolve(true);
            } else {
                promise.resolve(true);
            }
        }
    }
}
