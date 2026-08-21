(function () {
  const CONFIG = {
    supabaseUrl: 'https://yxeatkqsikzitxqqdfvc.supabase.co',
    supabaseAnonKey: 'sb_publishable_PrBvWZ44-iPDPAp9yu0n2A_JrQSX4to',
    tableName: 'guests'
  };

  const GuestDB = {
    client: null,

    init() {
      if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || CONFIG.supabaseUrl.includes('PASTE_') || CONFIG.supabaseAnonKey.includes('PASTE_')) {
        return false;
      }

      try {
        this.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
        return true;
      } catch (error) {
        console.warn('Supabase init failed:', error);
        return false;
      }
    },

    isConfigured() {
      return !!this.client;
    },

    async saveGuest(name) {
      if (!this.client) return false;

      const trimmed = String(name || '').trim();
      if (!trimmed) return false;

      const { error } = await this.client.from(CONFIG.tableName).insert([
        { name: trimmed, status: 'confirmed' }
      ]);

      if (error) {
        console.warn('Supabase insert failed:', error);
        return false;
      }

      return true;
    },

    async getGuests() {
      if (!this.client) return [];

      const { data, error } = await this.client
        .from(CONFIG.tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase select failed:', error);
        return [];
      }

      return data || [];
    }
  };

  window.GuestDB = GuestDB;
  GuestDB.init();
})();
