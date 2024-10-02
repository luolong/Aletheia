import proxy from "impl/proxy.ts";
import { Alert, asAlertSeverity, asAlertStatus } from "../components/Alert.tsx";
import { FreshContext } from "$fresh/server.ts";

export default async function Home(_req: Request, _ctx: FreshContext) {
  const alerts = await proxy.getAlerts();

  return (
    <>
      <header>
        <div class="title-wrapper">
          <h1>Aletheia</h1>
          <p>Your alerts all in one place</p>
        </div>
        <nav>
          <ul>
            <li>Alerts</li>
            <li>Silences</li>
          </ul>
        </nav>
      </header>
      <main>
        {alerts && (
          <>
            <section class="alerts-list">
              {alerts?.map((alert) => (
                <Alert
                  key={alert.fingerprint}
                  status={asAlertStatus(alert.status)}
                  severity={asAlertSeverity(alert.labels.severity)}
                  title={alert.annotations.summary ?? alert.labels.alertname}
                  description={alert.annotations.description}
                />
              ))}
            </section>
          </>
        )}
      </main>
      <footer>
        <section class="column">
          <ul>
            <li>Home</li>
            <li>Alerts</li>
            <li>Silences</li>
          </ul>
        </section>
      </footer>
    </>
  );
}
