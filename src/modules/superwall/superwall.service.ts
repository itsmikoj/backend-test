
import { supabase } from "../../utils/supabaseClient";
import { SuperwallEventInterface } from "./interfaces/superwall.interface";
import { SuperwallWebhookPayload } from './superwall.interface';
import { SuperwallLogger, SuperwallMapper } from './superwall.utils';

export const handleSuperwallEvent = async (payload: SuperwallWebhookPayload) => {

  const { type, data } = payload;
  const { bundleId, proceeds, productId, store, expirationAt } = data;

  if (!bundleId) {
    console.warn(`⚠️ Evento sin bundle_id - ignorando`);
    return { success: false, message: "Sin bundle_id" };
  }

  let appTrackerId: string | null = null;

  try {
    const { data: appTracker, error: searchError } = await supabase
      .from("app-tracker")
      .select("id, app_name, user_id")
      .eq("bundle_id", bundleId)
      .maybeSingle();

    if (searchError) {
      console.error(`❌ Error buscando app-tracker: ${searchError.message}`);
      return { success: false, message: "Error verificando bundle_id" };
    }

    if (!appTracker) {
      console.log(`⚠️ Bundle ID ${bundleId} NO está registrado en app-tracker`);
      console.log(`⚠️ Evento ${data.id} NO será guardado`);
      return { success: false, message: "Bundle ID no registrado" };
    }

    appTrackerId = appTracker.id;

  } catch (error) {
    console.error(`❌ Error verificando bundle_id: ${error}`);
    return { success: false, message: "Error verificando bundle_id" };
  }

  try {
    const eventRecord = SuperwallMapper.toEventRecord(payload, appTrackerId);
    
    const { error: insertError } = await supabase
      .from('superwall_events')
      .insert(eventRecord);

    if (insertError) {
      if (insertError.code === '23505') {
        console.log(`⚠️ Evento duplicado ignorado: ${data.id}`);
        return { success: true, message: "Evento duplicado" };
      }
      console.error(`❌ Error guardando evento: ${insertError.message}`);
      throw new Error(insertError.message);
    }

    if (expirationAt) {
      console.log(`   ⏰ Expira: ${new Date(expirationAt).toISOString()}`);
    }

    switch (type) {
      case "initial_purchase":
        console.log(`   🎉 Nueva compra inicial registrada`);
        break;
      case "renewal":
        console.log(`   🔄 Renovación registrada`);
        break;
      case "non_renewing_purchase":
        console.log(`   💳 Compra única registrada`);
        break;
      case "expiration":
        console.log(`   ⏱️  Expiración registrada`);
        if (data.expirationReason) {
          console.log(`   Razón: ${data.expirationReason}`);
        }
        break;
      
    }

    return { 
      success: true, 
      message: "Evento guardado correctamente",
      eventType: type,
      appTrackerId,
      eventId: data.id
    };

  } catch (error: any) {
    console.error("❌ Error al guardar evento:", error);
    return { 
      success: false, 
      message: error.message 
    };
  }
};

export const getAllSuperwallEventsService = async (appTrackerId:string) => {
  const { data, error } = await supabase
    .from("superwall_events")
    .select("*")
    .eq("app_tracker_id", appTrackerId)
    .order("created_at", { ascending: false });

    if (error) {
      throw new Error("getAllSuperwallEventsService: " + error.message);
    }

    return data as SuperwallEventInterface[];
 }