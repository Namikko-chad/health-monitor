import { IHealthMonitorResponse } from './interfaces';

export function render(data: IHealthMonitorResponse): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Status</title>
      </head>
      <body>
        <table>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
          ${data
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.status}</td>
              <td>${item.timestamp}</td>
            </tr>
          `,
            )
            .join('')}
        </table>
      </body>
    </html>
  `;
}
