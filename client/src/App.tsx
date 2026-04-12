import { createSignal, onCleanup, Show } from "solid-js";



type Orientation =
  { isAbsolute: boolean, alpha: number | null, beta: number | null, gamma: number | null }


const isPermissionRequired = "requestPermission" in DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function";

export default function App() {
  const dismountAbortController = new AbortController();
  onCleanup(() => dismountAbortController.abort());

  const [orientation, setOrientation] = createSignal<Orientation | undefined>();

  function setUpListener() {
    window.addEventListener("deviceorientation", (event) => {
      console.debug("DeviceOrientationEvent", event);

      setOrientation({
        isAbsolute: event.absolute,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });

    }, {
      signal: dismountAbortController.signal,
    })
  }

  async function requestOrientation() {
    if ("requestPermission" in DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result !== "granted") return;
    }


    setUpListener();
  }

  if (!isPermissionRequired) setUpListener();

  return (
    <main>
      <Show when={orientation()}>
        {(orientation) => (<dl>
          <dt>isAbsolute</dt>
          <dd>{orientation().isAbsolute.toString()}</dd>
          <dt>alpha</dt>
          <dd>{orientation().alpha?.toString() ?? "null"}</dd>
          <dt>beta</dt>
          <dd>{orientation().beta?.toString() ?? "null"}</dd>
          <dt>gamma</dt>
          <dd>{orientation().gamma?.toString() ?? "null"}</dd>
        </dl>)}
      </Show>

      <Show when={isPermissionRequired}>
        <p>Access to orientation data is required for this app to work</p>
        <button onClick={requestOrientation}>Allow access</button>
      </Show>
    </main>
  )
}

