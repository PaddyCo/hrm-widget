import { useState } from "react";
import { BpmRange, SocketSettings } from "../App";
import { Formik, Field, Form, ErrorMessage } from "formik";

export interface SettingsData {
  minBpm: number;
  maxBpm: number;
  pulsoidToken: string;
  debugEnabled: boolean;
}

interface SettingsProps {
  initialPulsoidToken: string | undefined;
  initialBpmRange: BpmRange;
  initialDebugEnabled: boolean;
  onSubmit: (data: SettingsData) => void;
}

export default function Settings({
  initialPulsoidToken,
  initialBpmRange,
  initialDebugEnabled,
  onSubmit,
}: SettingsProps) {
  function validate(data: SettingsData) {
    const errors: any = {};

    if (!data.minBpm) {
      errors.minBpm = "Min BPM is required";
    }

    if (!data.maxBpm) {
      errors.minBpm = "Max BPM is required";
    }

    if (data.minBpm > data.maxBpm) {
      errors.maxBpm = "Max BPM has to be higher than Min BPM";
    }

    if (!data.pulsoidToken) {
      errors.pulsoidToken = "Token has to be set";
    }

    return errors;
  }

  return (
    <div className="settings">
      <Formik
        initialValues={{
          minBpm: initialBpmRange[0],
          maxBpm: initialBpmRange[1],
          debugEnabled: initialDebugEnabled,
          pulsoidToken: initialPulsoidToken ?? "",
        }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="settings__section">
              <label htmlFor="pulsoidToken">Pulsoid Token</label>
              <Field name="pulsoidToken" type="password" />
              {errors.pulsoidToken && touched.pulsoidToken ? (
                <div className="settings__error">{errors.pulsoidToken}</div>
              ) : null}
              <p>Token for the Pulsoid websocket stream</p>
            </div>
            <div className="settings__section">
              <label htmlFor="minBpm">BPM Min</label>
              <Field name="minBpm" type="number" />
              {errors.minBpm && touched.minBpm ? (
                <div className="settings__error">{errors.minBpm}</div>
              ) : null}
              <p>The lower bound of the BPM chart</p>
            </div>
            <div className="settings__section">
              <label htmlFor="bpmMax">BPM Max</label>
              <Field name="maxBpm" type="number" />
              {errors.maxBpm && touched.maxBpm ? (
                <div className="settings__error">{errors.maxBpm}</div>
              ) : null}
              <p>The upper bound of the BPM chart</p>
            </div>
            <div className="settings__section">
              <label htmlFor="debugEnabled">Debug</label>
              <Field name="debugEnabled" type="checkbox" />
              <p>Enables you to manually set current heart rate</p>
            </div>
            <button type="submit" className="settings__done">
              Done
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
