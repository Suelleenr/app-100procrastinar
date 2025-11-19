'use client'

import { AlertCircle, ExternalLink, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CorsErrorAlert() {
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://3000-iq1ocu51hsrkuu0eooerc.e2b.app'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ygkykbmmowqadpvhbjgo.supabase.co'
  const projectId = supabaseUrl.split('//')[1]?.split('.')[0] || 'ygkykbmmowqadpvhbjgo'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-red-50 dark:bg-red-950/20 border-b">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
            <div>
              <CardTitle className="text-red-900 dark:text-red-100">
                🚨 Configuração Obrigatória do Supabase
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-300 mt-1">
                O Supabase está bloqueando as requisições. Siga os passos abaixo para resolver:
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Passo 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg">Acesse o Dashboard do Supabase</h3>
            </div>
            <div className="ml-10 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Abra o dashboard do seu projeto Supabase:
              </p>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}`, '_blank')}
              >
                <span>Abrir Dashboard do Supabase</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg">Configure os Domínios Permitidos</h3>
            </div>
            <div className="ml-10 space-y-3">
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                <li>No menu lateral, clique em <strong>Authentication</strong></li>
                <li>Clique em <strong>URL Configuration</strong></li>
                <li>Em <strong>Site URL</strong>, cole o domínio abaixo:</li>
              </ol>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border">
                <code className="text-sm break-all">{currentDomain}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => navigator.clipboard.writeText(currentDomain)}
                >
                  Copiar
                </Button>
              </div>

              <ol start={4} className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
                <li>Em <strong>Redirect URLs</strong>, adicione estas URLs (uma por linha):</li>
              </ol>

              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border space-y-1">
                <div className="flex items-center justify-between">
                  <code className="text-sm break-all">{currentDomain}/**</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(`${currentDomain}/**`)}
                  >
                    Copiar
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-sm">http://localhost:3000/**</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText('http://localhost:3000/**')}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>5.</strong> Clique em <strong className="text-green-600 dark:text-green-400">Save</strong> (Salvar)
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg">Desative a Confirmação de Email (Opcional)</h3>
            </div>
            <div className="ml-10 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Para testar rapidamente sem precisar confirmar email:
              </p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Em <strong>Authentication</strong> → <strong>Providers</strong></li>
                <li>Clique em <strong>Email</strong></li>
                <li><strong>Desative</strong> a opção "Confirm email"</li>
                <li>Clique em <strong>Save</strong></li>
              </ol>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Recarregue Esta Página</h3>
            </div>
            <div className="ml-10 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Após salvar as configurações no Supabase, recarregue esta página (F5) e tente criar sua conta novamente.
              </p>
              <Button
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Recarregar Página Agora
              </Button>
            </div>
          </div>

          {/* Alerta Importante */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription className="text-sm">
              O domínio <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">e2b.app</code> muda a cada sessão. 
              Se o erro voltar depois, você precisará atualizar o domínio novamente no Supabase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
