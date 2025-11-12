// insert_phrases.js
const {createClient} = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();

// ⚙️ Configura tus credenciales:
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
 console.log("not found env");
 return;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const initRow = 101
const endRow = 132
const startDate = new Date('2026-02-07'); //editar esta fila de acuerdo a la fecha de inicio de la tabla

async function run() {
  console.log('🔄 Cargando datos de phrase_en y phrase_es...');

  // 1️⃣ Obtener las frases
   const { data: enRows, error: enError } = await supabase
  .from('phrase_history_en')
  .select('id, phrase')
  .gte('id', initRow)
  .lte('id', endRow)    // menor que
  .order('id', { ascending: true });

const { data: esRows, error: esError } = await supabase
  .from('phrase_history_es')
  .select('id, phrase')
  .gte('id', initRow)
  .lte('id', endRow)  .order('id', { ascending: true });


  if (enError || esError) {
    console.error('❌ Error al obtener datos:', enError || esError);
    return;
  }

  console.log(`✅ Se obtuvieron ${enRows.length} frases en inglés y ${esRows.length} en español`);

  // 2️⃣ Combinar por id
  const combined = [];

   // porque el id 7 es el séptimo elemento (índice 6)
for (let i = 0; i < Math.min(enRows.length, esRows.length); i++) {
  const en = enRows[i];
  const es = esRows[i];

    const createAt = new Date(startDate);
    createAt.setDate(startDate.getDate() + i); // suma 1 día por fila

    combined.push({
      phrase: en.phrase,
      phrase_es: es.phrase,
      createdAt: createAt.toISOString().split('T')[0], // formato YYYY-MM-DD
    });
  }

  console.log(`🧩 Preparando ${combined.length} filas para insertar...`);

  // 3️⃣ Insertar en batches por si acaso (100 por batch)
  const batchSize = 100;
  for (let i = 0; i < combined.length; i += batchSize) {
    const batch = combined.slice(i, i + batchSize);
    console.log({batch});
    
    const { error: insertError } = await supabase
      .from('phrase_history_en_cloudinary')
      .upsert(batch, { onConflict: 'id' }); // evita duplicados
      // .insert(batch);

    if (insertError) {
      console.error('⚠️ Error al insertar:', insertError);
      return;
    }
    console.log(`✅ Insertadas ${batch.length} filas`);
  }

  console.log('🎉 Proceso completado con éxito');
}

run();

// comando para ejecutar en terminal
// node src/scripts/insert_phrese.js