package com.example.smartmeterdev.messaging;

import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class TaskScheduler {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private ScheduledFuture<?> scheduledTask;
    private boolean isSendingData = false;

    public void startSendingWithPause(Runnable sendDataTask, long activePeriodMillis, long pausePeriodMillis) {
        isSendingData = true;

        scheduleTask(sendDataTask);

        scheduler.schedule(() -> {
            pauseData(sendDataTask, activePeriodMillis, pausePeriodMillis);
        }, activePeriodMillis, TimeUnit.MILLISECONDS);
    }

    private void scheduleTask(Runnable sendDataTask) {
        scheduledTask = scheduler.scheduleAtFixedRate(() -> {
            if (isSendingData) {
                sendDataTask.run();
            }
        }, 0, 10, TimeUnit.SECONDS);
    }


    private void pauseData(Runnable sendDataTask, long activePeriodMillis, long pausePeriodMillis) {
        System.out.println("80 seconds passed. Pausing for 2 minutes...");
        isSendingData = false;

        if (scheduledTask != null) {
            scheduledTask.cancel(false);
        }

        scheduler.schedule(() -> {
            resumeDataSending(sendDataTask, activePeriodMillis, pausePeriodMillis);
        }, pausePeriodMillis, TimeUnit.MILLISECONDS);
    }

    private void resumeDataSending(Runnable sendDataTask, long activePeriodMillis, long pausePeriodMillis) {
        System.out.println("2 minutes passed. Resuming data sending...");
        isSendingData = true;

        scheduleTask(sendDataTask);
        scheduler.schedule(() -> {
            pauseData(sendDataTask, activePeriodMillis, pausePeriodMillis);
        }, activePeriodMillis, TimeUnit.MILLISECONDS);
    }

    public void stopScheduler() {
        if (scheduledTask != null) {
            scheduledTask.cancel(false);
        }
        scheduler.shutdown();
    }

}