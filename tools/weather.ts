import type { WeatherData, WeatherCondition } from '../types/weather-types.js';
import type { MCPClient } from '../src/mcp-client.js';

export class WeatherTool {
  private readonly conditions: WeatherCondition[] = [
    'sunny', 'cloudy', 'rainy', 'snowy', 'partly-cloudy', 'stormy'
  ];
  private readonly temperatures: number[] = [65, 72, 68, 45, 80, 55, 38, 75, 82, 41];

  async getWeather(city: string): Promise<string> {
    try {
      // Simple weather simulation - replace with actual API call
      const condition = this.conditions[Math.floor(Math.random() * this.conditions.length)];
      const temp = this.temperatures[Math.floor(Math.random() * this.temperatures.length)];
      
      return `Weather in ${city}: ${condition}, ${temp}°F`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get weather for ${city}: ${errorMessage}`);
    }
  }

  async getWeatherFromMCP(client: MCPClient, city: string): Promise<string> {
    try {
      if (!client.isConnected()) {
        throw new Error('MCP client is not connected');
      }

      const result = await client.callTool('get_weather', { location: city });
      return result[0]?.text || 'Weather data unavailable';
    } catch (error) {
      console.warn('MCP weather call failed, falling back to simulation');
      return this.getWeather(city);
    }
  }

  async testMCPWeatherServers(client: MCPClient, city: string): Promise<string[]> {
    const results: string[] = [];
    
    try {
      await client.connectToWeatherServer();
      const tools = await client.listTools();
      results.push(`✅ Weather server connected with ${tools.length} tools`);
      
      // Test weather tool if available
      const weatherTool = tools.find(t => t.name.includes('weather') || t.name.includes('get_weather'));
      if (weatherTool) {
        try {
          const weather = await client.callTool(weatherTool.name, { location: city });
          results.push(`🌤️ Weather test: ${weather[0]?.text || 'No data'}`);
        } catch (error) {
          results.push(`❌ Weather tool test failed: ${error}`);
        }
      } else {
        results.push('⚠️ No weather tool found');
      }
    } catch (error) {
      results.push(`❌ Weather server connection failed: ${error}`);
    }
    
    return results;
  }

  async getDetailedWeather(city: string): Promise<WeatherData> {
    const condition = this.conditions[Math.floor(Math.random() * this.conditions.length)];
    const temp = this.temperatures[Math.floor(Math.random() * this.temperatures.length)];
    const humidity = Math.floor(Math.random() * 100);
    const windSpeed = Math.floor(Math.random() * 25);

    return {
      city,
      condition,
      temperature: temp,
      humidity,
      windSpeed,
      timestamp: new Date().toISOString()
    };
  }
}