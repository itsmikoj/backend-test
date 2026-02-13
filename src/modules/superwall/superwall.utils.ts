// modules/superwall/superwall.utils.ts

import { SuperwallWebhookPayload, SuperwallEventData } from './superwall.interface';

export class SuperwallLogger {
  static logFullPayload(payload: SuperwallWebhookPayload): void {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📦 PAYLOAD COMPLETO:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  static logEventMetadata(payload: SuperwallWebhookPayload): void {
    console.log("🔍 METADATA DEL EVENTO:");
    console.log(`   Type: ${payload.type}`);
    console.log(`   Project ID: ${payload.projectId}`);
    console.log(`   Application ID: ${payload.applicationId}`);
    console.log(`   Timestamp: ${payload.timestamp} (${new Date(payload.timestamp).toISOString()})\n`);
  }

  static logEventData(data: SuperwallEventData): void {
    console.log("💡 CAMPOS CLAVE:");
    console.log(`   👤 Usuario: ${data.originalAppUserId}`);
    console.log(`   💰 Precio: $${data.price} ${data.currencyCode}`);
    console.log(`   💵 Ingresos netos: $${data.proceeds} USD`);
    console.log(`   🏷️  Producto: ${data.productId}`);
    console.log(`   📆 Periodo: ${data.periodType}`);
    console.log(`   🏪 Tienda: ${data.store}`);
    console.log(`   🌍 Ambiente: ${data.environment}`);
    console.log(`   🌎 País: ${data.countryCode}`);
    
    if (data.priceInPurchasedCurrency !== data.price) {
      console.log(`   💱 Precio original: $${data.priceInPurchasedCurrency} ${data.currencyCode} (Rate: ${data.exchangeRate})`);
    }
    
    console.log(`   📊 Comisión: ${(data.commissionPercentage * 100).toFixed(1)}%`);
    console.log(`   💰 Tu ganancia: ${(data.takehomePercentage * 100).toFixed(1)}%`);
    
    if (data.isTrialConversion) console.log(`   🎯 Conversión de trial: SÍ`);
    if (data.isFamilyShare) console.log(`   👨‍👩‍👧‍👦 Family Share: SÍ`);
    if (data.offerCode) console.log(`   🎟️  Código oferta: ${data.offerCode}`);

    console.log("\n🔢 TRANSACTION IDs:");
    console.log(`   Current: ${data.transactionId}`);
    console.log(`   Original: ${data.originalTransactionId}`);

    if (data.purchasedAt) {
      console.log(`\n📅 FECHAS:`);
      console.log(`   Comprado: ${new Date(data.purchasedAt).toISOString()}`);
      if (data.expirationAt) {
        console.log(`   Expira: ${new Date(data.expirationAt).toISOString()}`);
      }
    }

    if (data.cancelReason) console.log(`\n❌ Razón cancelación: ${data.cancelReason}`);
    if (data.expirationReason) console.log(`\n⏰ Razón expiración: ${data.expirationReason}`);
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
}

export class SuperwallMapper {
  static toEventRecord(
    payload: SuperwallWebhookPayload, 
    appTrackerId: string | null = null
  ): any {
    const { type, projectId, applicationId, applicationName, data } = payload;
    
    return {
      event_type: type,
      event_name: data.name,
      superwall_event_id: data.id,
      application_id: applicationId,
      application_name: applicationName || null,
      project_id: projectId,
      bundle_id: data.bundleId,
      environment: data.environment,
      store: data.store,
      original_app_user_id: data.originalAppUserId || 'UNKNOWN',
      product_id: data.productId,
      period_type: data.periodType,
      currency_code: data.currencyCode,
      price: data.price,
      proceeds: data.proceeds,
      purchased_at: data.purchasedAt ? new Date(data.purchasedAt).toISOString() : null,
      expiration_at: data.expirationAt ? new Date(data.expirationAt).toISOString() : null,
      app_tracker_id: appTrackerId,
    };
  }
}